import './scss/styles.scss';
import { Api } from './components/base/api';
import { Catalog, Cart, Order } from './components/base/models';
import { CatalogView } from './components/view/catalogView';
import { ProductCard } from './components/view/productCard';
import { ProductDetailView } from './components/view/productDetailView';
import { Modal } from './components/view/modal';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants'; 
import { ensureElement } from './utils/utils';
import { Product, ICartItem } from './types';
import { CartView } from './components/view/cartView';
import { PaymentFormView } from './components/view/paymentFormView';
import { ContactFormView } from './components/view/contactFormView';
import { OrderSuccessView } from './components/view/orderSuccessView';

// Создаем экземпляр API, eventEmitter
const api = new Api(API_URL);
const eventEmitter = new EventEmitter();

// Создаем экземпляры каталога и представления каталога
const catalog = new Catalog();
const catalogContainer = ensureElement<HTMLElement>('.gallery');
const catalogView = new CatalogView(catalogContainer);

const modal = new Modal();

// Глобальная переменная счётчика
const basketCounterEl = document.querySelector('.header__basket-counter') as HTMLElement || null;
// Обновляем счетчик корзины
function updateBasketCounter() {
  if (!basketCounterEl) return;
  basketCounterEl.textContent = String(cart.getItems().length);
}

// Создаем экземпляры корзины, ее представления и заказа
const cart = new Cart();
const cartView = new CartView(eventEmitter);

const order = new Order();
// Создаем экземпляры форм
const paymentFormView = new PaymentFormView(eventEmitter);
const contactFormView = new ContactFormView();

// Детальный просмотр товара
const productDetailView = new ProductDetailView();

contactFormView.setOnInput((email, phone) => {
  order.setEmail(email);
  order.setPhone(phone);

  const errors = order.validateSecondStep();
  contactFormView.displayErrors(errors);
  contactFormView.highlightInvalidFields(errors);

  const isValid = errors.length === 0;
  contactFormView.updateSubmitButtonState(isValid);
});

contactFormView.setOnSubmit(async () => {
  const errors = order.validateSecondStep();
  if (errors.length === 0) {
    try {
      await api.post('/order', {
        payment: order.getPaymentMethod(),
        email: order.getEmail(),
        phone: order.getPhone(),
        address: order.getDeliveryAddress(),
        total: cart.calculateTotal(),
        items: cart.getItems().map((item) => item.productId),
      });
      showOrderSuccess();
    } catch (error) {
      alert(`Ошибка при оформлении заказа: ${error}`);
    }
  } else {
    contactFormView.displayErrors(errors);
    contactFormView.highlightInvalidFields(errors);
  }
});


const orderSuccessView = new OrderSuccessView();
orderSuccessView.setOnClose(() => {
  modal.close();
});

// Удаление товаров из корзины
eventEmitter.on<{ productId: string }>('cart:remove', ({ productId }) => {
  cart.removeItem(productId);
  updateBasketCounter();

  const itemMarkup = generateCartItemsMarkup(cart.getItems());
  cartView.updateCart(itemMarkup, cart.calculateTotal());
});

function generateCartItemsMarkup(items: ICartItem[]): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const template = document.getElementById('card-basket') as HTMLTemplateElement;

  if (!template) {
    throw new Error('Template with ID "card-basket" not found');
  }

  items.forEach((item, index) => {
    const clone = template.content.cloneNode(true) as HTMLElement;

    const indexElement = clone.querySelector('.basket__item-index') as HTMLElement;
    if (indexElement) indexElement.textContent = String(index + 1);

    const titleElement = clone.querySelector('.card__title') as HTMLElement;
    if (titleElement) titleElement.textContent = item.title;

    const priceElement = clone.querySelector('.card__price') as HTMLElement;
    if (priceElement) priceElement.textContent = `${item.price.toLocaleString()} синапсов`;

    const deleteButton = clone.querySelector('.basket__item-delete') as HTMLElement;
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        eventEmitter.emit('cart:remove', { productId: item.productId });
      });
    }

    fragment.appendChild(clone);
  });

  return fragment;
}

// При нажатии «Оформить»
eventEmitter.on('cart:checkout', () => {
  handleCheckoutClick();
});

// Кнопка «Корзина» в шапке
const basketButton = document.querySelector('.header__basket');
if (basketButton) {
  basketButton.addEventListener('click', openCartModal);
}

// Открываем корзину
function openCartModal() {
  const itemMarkup = generateCartItemsMarkup(cart.getItems());
  cartView.updateCart(itemMarkup, cart.calculateTotal());
  modal.setContent(cartView.getElement());
  modal.open();
}

// Валидация первого шага
function handleCheckoutClick() {
  modal.setContent(paymentFormView.render());
  paymentFormView.bindEvents(() => {
    const data = paymentFormView.getData();
    order.setDeliveryAddress(data.deliveryAddress);

    const errors = order.validateFirstStep();
    if (errors.length === 0) {
      openContactForm();
    } else {
      paymentFormView.displayErrors(errors); // Отображаем ошибки
    }
  });

  eventEmitter.on<{ method: string }>('order:paymentMethodSelected', ({ method }) => {
    order.setPaymentMethod(method);
  });
}

// Второй шаг — форма контактов
function openContactForm() {
  contactFormView.show();
  modal.setContent(contactFormView.render());
  modal.open();
}

// Показываем успех
function showOrderSuccess() {
  const totalAmount = cart.calculateTotal();
  cart.clearCart();
  updateBasketCounter();

  orderSuccessView.setTotalAmount(totalAmount);
  modal.setContent(orderSuccessView.render());
  modal.open();
}

// Добавление товара в корзину
function addToCart(product: Product) {
  if (product.price === null || product.price === 0) return;

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
      const productCard = new ProductCard(product, eventEmitter);
      return productCard.getElement();
    });

    catalogView.renderCatalog(cards);
    catalogView.bindCardEvents(cards, handleCardClick);
  } catch (error) {
    alert('Ошибка при загрузке каталога');
  }
}

// Событие «product:selected»
eventEmitter.on<Product>('product:selected', (product) => {
  productDetailView.render({
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: `${CDN_URL}/${product.image}`,
  });

  const inCart = cart.getItems().some(i => i.productId === product.id);
  productDetailView.setIsInCart(inCart);

  const addToCartButton = productDetailView.getElement().querySelector('.card__button') as HTMLButtonElement;
  if (addToCartButton && (product.price === null || product.price === 0)) {
    addToCartButton.disabled = true;
  }

  productDetailView.bindAddToCart(() => {
    addToCart(product);
    productDetailView.setIsInCart(true);
  });

  modal.setContent(productDetailView.getElement());
  modal.open();
});

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

// При загрузке страницы — загрузить каталог
document.addEventListener('DOMContentLoaded', loadCatalog);