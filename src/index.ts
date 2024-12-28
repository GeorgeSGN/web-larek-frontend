import './scss/styles.scss';
import { Api } from './components/base/api';
import { Catalog, Cart, Order } from './components/base/models';
import { CatalogView } from './components/view/catalogView';
import { ProductCard } from './components/view/productCard';
import { ProductDetailView } from './components/view/productDetailView';
import { Modal } from './components/view/modal';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants'; 
import { ensureElement, setElementData } from './utils/utils';
import { Product } from './types';
import { CartView } from './components/view/cartView';
import { PaymentFormView } from './components/view/paymentFormView';
import { ContactFormView } from './components/view/contactFormView';
import { OrderSuccessView } from './components/view/orderSuccessView';

// Создаем экземпляр API
const api = new Api(API_URL);
const eventEmitter = new EventEmitter();

// Создаем экземпляры каталога и представления каталога
const catalog = new Catalog();
const catalogContainer = ensureElement<HTMLElement>('.gallery');
if (!catalogContainer) {
  throw new Error('Gallery container element not found in DOM');
}
const catalogView = new CatalogView(catalogContainer);

// Контейнер для модального окна
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modalContent = modalContainer.querySelector('.modal__content') as HTMLElement;
if (!modalContent) {
  throw new Error('Content element not found in modal container');
}
const modal = new Modal(modalContent);

// Детальный просмотр товара
const productDetailView = new ProductDetailView(modalContent);

// Создаем экземпляры корзины, ее представления и заказа
const cart = new Cart();
const cartView = new CartView(modalContent, eventEmitter);
const order = new Order();

// Создаем экземпляры форм
const paymentFormView = new PaymentFormView(modalContent, eventEmitter);
const contactFormView = new ContactFormView(modalContent);

const orderSuccessView = new OrderSuccessView(modalContent);


// Обновляем счетчик корзины
function updateBasketCounter() {
  const basketCounter = document.querySelector('.header__basket-counter');
  if (basketCounter) {
    basketCounter.textContent = String(cart.getItems().length);
  }
}

// Открываем корзину
function openCartModal() {
  // Рендерим через cartView
  cartView.updateCart(cart.getItems(), cart.calculateTotal());
  modal.open();
}

eventEmitter.on<{ productId: string }>('cart:remove', ({ productId }) => {
  // Удаляем из модели
  cart.removeItem(productId);
  // Обновляем счётчик
  updateBasketCounter();
  // Ререндерим cartView
  cartView.updateCart(cart.getItems(), cart.calculateTotal());
});

// При нажатии «Оформить»
eventEmitter.on('cart:checkout', () => {
  handleCheckoutClick();
});

// Обработка кнопки «Оформить»
function handleCheckoutClick() {
  paymentFormView.render();
  paymentFormView.bindEvents(() => {
    const data = paymentFormView.getData();

    // Заполняем адрес доставки
    order.setDeliveryAddress(data.deliveryAddress);

    const errors = order.validateOrder();
    if (errors.length === 0) {
      order.setIsSecondStep(true);
      openContactForm(); // переходим на второй шаг
    } else {
      alert(`Ошибки: ${errors.join('\n')}`);
    }
  });

  eventEmitter.on<{ method: string }>('order:paymentMethodSelected', ({ method }) => {
    order.setPaymentMethod(method);
  });
}

// Второй шаг — форма контактов
function openContactForm() {
  contactFormView.render();

  // делаем колбэк асинхронным
  contactFormView.bindEvents(async () => {
    const { email, phone } = contactFormView.getData();
    order.setEmail(email);
    order.setPhone(phone);

    const errors = order.validateOrder();
    if (errors.length === 0) {
      // Пытаемся отправить заказ
      try {
        // Формируем «тело» запроса так, как нужно бэкенду
        // (payment, email, phone, address, total, items[])
        const orderData = {
          payment:  order.getPaymentMethod(),
          email:    order.getEmail(),
          phone:    order.getPhone(),
          address:  order.getDeliveryAddress(),
          total:    cart.calculateTotal(),
          items:    cart.getItems().map(item => item.productId),
        };

        // Выполняем запрос
        await api.post('/order', orderData);

        // Показываем успех, чистим корзину
        showOrderSuccess();
      } catch (error) {
        alert(`Ошибка при оформлении заказа: ${error}`);
      }
    } else {
      alert(`Ошибки: ${errors.join('\n')}`);
    }
  });
}

// Показываем успех
function showOrderSuccess() {
  // Сумму нужно взять до очистки корзины
  const totalAmount = cart.calculateTotal();

  // Очищаем контейнер модалки
  modalContent.innerHTML = '';

  // Рендерим успех
  const successElement = orderSuccessView.render(totalAmount);
  modalContent.appendChild(successElement);

  // Чистим корзину
  cart.clearCart();
  updateBasketCounter();

  // Кнопка «Закрыть»
  const closeButton = modalContent.querySelector('.order-success__close') as HTMLButtonElement;
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.close();
    });
  }
}

// Кнопка «Корзина» в шапке
const basketButton = document.querySelector('.header__basket');
if (basketButton) {
  basketButton.addEventListener('click', openCartModal);
}

// Добавление товара в корзину
function addToCart(product: Product) {
  if (!cart.getItems().some((item) => item.productId === product.id)) {
    cart.addItem({
      productId: product.id,
      title: product.title,
      price: product.price || 0,
      category: product.category,
    });
    updateBasketCounter();
  }
}

// Загрузка и отображение каталога
async function loadCatalog() {
  try {
    const response = await api.get('/product');
    const items = (response as { items: Product[] }).items;

    catalog.setProducts(items);

    const cards = items.map((product) => {
      const productCard = new ProductCard(product)
      return productCard.getElement();
    });
    
    catalogView.renderCatalog(cards);
    catalogView.bindCardEvents(cards, handleCardClick);
  } catch (error) {
    alert('Ошибка при загрузке каталога');
  }
}

// Обработка клика по карточке
function handleCardClick(event: Event) {
  const target = event.target as HTMLElement;
  const cardElement = target.closest('.gallery__item') as HTMLElement;
  if (!cardElement) return;

  const productId = cardElement.dataset.productId;
  if (!productId) return;

  const product = catalog.getProducts().find(p => p.id === productId);
  if (!product) return;

  eventEmitter.emit('product:selected', product);
}

// Событие «product:selected»
eventEmitter.on<Product>('product:selected', (product) => {
  productDetailView.render({
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: `${CDN_URL}/${product.image}`
  });

  const button = modalContent.querySelector('.card__button') as HTMLButtonElement;
  if (!button) {
    return;
  }

  // Если товар уже в корзине
  if (cart.getItems().some((i) => i.productId === product.id)) {
    button.textContent = 'Уже в корзине';
    button.disabled = true;
  }

  button.addEventListener('click', () => {
    addToCart(product);
    button.textContent = 'Уже в корзине';
    button.disabled = true;
  });

  modal.open();
});

// При загрузке страницы — загрузить каталог
document.addEventListener('DOMContentLoaded', loadCatalog);
