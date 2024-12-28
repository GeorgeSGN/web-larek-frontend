// import './scss/styles.scss';
// import { Api } from './components/base/api';
// import { Catalog, Cart, Order } from './components/base/models';
// import { CatalogView } from './components/view/catalogView';
// import { ProductCard } from './components/view/productCard';
// import { ProductDetailView } from './components/view/productDetailView';
// import { Modal } from './components/view/modal';
// import { EventEmitter } from './components/base/events';
// import { API_URL, CDN_URL } from './utils/constants';
// import { ensureElement, setElementData } from './utils/utils';
// import { Product } from './types';
// import { CartView } from './components/view/cartView';
// import { PaymentFormView } from './components/view/paymentFormView';
// import { ContactFormView } from './components/view/contactFormView';

// // Создаем экземпляр API
// const api = new Api(API_URL);
// const eventEmitter = new EventEmitter();

// // Создаем экземпляры каталога и представления каталога
// const catalog = new Catalog();
// const catalogContainer = ensureElement<HTMLElement>('.gallery');
// if (!catalogContainer) {
//   throw new Error('Gallery container element not found in DOM');
// }

// const catalogView = new CatalogView(catalogContainer);

// // Контейнер для модального окна
// const modalContainer = ensureElement<HTMLElement>('#modal-container');
// const modalContent = modalContainer.querySelector('.modal__content') as HTMLElement;
// if (!modalContent) {
//   throw new Error('Content element not found in modal container');
// }
// const modal = new Modal(modalContent);

// const productDetailView = new ProductDetailView(modalContent);

// // Создаем экземпляры корзины и её представления
// const cart = new Cart();
// const cartView = new CartView(modalContent);
// const order = new Order();

// // Создаём экземпляры PaymentFormView и ContactFormView
// const paymentFormView = new PaymentFormView(modalContent, eventEmitter);
// const contactFormView = new ContactFormView(modalContent);

// // Функция для обновления счетчика корзины
// function updateBasketCounter() {
//   const basketCounter = document.querySelector('.header__basket-counter');
//   if (basketCounter) {
//     basketCounter.textContent = `${cart.getItems().length}`;
//   }
// }

// // Функция для открытия корзины
// function openCartModal() {
//   const items = cart.getItems().map((item, index) => {
//     const cartItemElement = document.createElement('li');
//     cartItemElement.className = 'basket__item card card_compact';
//     cartItemElement.innerHTML = `
//       <span class="basket__item-index">${index + 1}</span>
//       <span class="card__title">${item.title}</span>
//       <span class="card__price">${(item.price || 0).toLocaleString()} синапсов</span>
//       <button class="basket__item-delete" aria-label="удалить"></button>
//     `;
//     setElementData(cartItemElement, { productId: item.productId });

//     // Добавляем обработчик удаления товара
//     const deleteButton = cartItemElement.querySelector('.basket__item-delete');
//     if (deleteButton) {
//       deleteButton.addEventListener('click', () => {
//         cart.removeItem(item.productId);
//         updateBasketCounter(); // Обновляем счетчик
//         openCartModal(); // Обновляем корзину после удаления
//       });
//     }

//     return cartItemElement;
//   });

//   cartView.renderCart(items);
//   cartView.bindItemEvents(items);

//   // Обновляем сумму товаров
//   const totalPriceElement = modalContent.querySelector('.basket__price');
//   if (totalPriceElement) {
//     totalPriceElement.textContent = `${cart.calculateTotal().toLocaleString()} синапсов`;
//   }

//   const checkoutButton = modalContent.querySelector('.basket__button') as HTMLButtonElement;
//   if (checkoutButton) {
//     checkoutButton.addEventListener('click', handleCheckoutClick);
//   }

//   modal.open();
// }

// // Функция для обработки кнопки "Оформить"
// function handleCheckoutClick() {
//   paymentFormView.render();
//   paymentFormView.bindEvents(() => {
//     // Получаем данные из PaymentFormView
//     const data = paymentFormView.getData();

//     // Устанавливаем адрес доставки
//     order.setDeliveryAddress(data.deliveryAddress);

//     const errors = order.validateOrder();
//     if (errors.length === 0) {
//       order.setIsSecondStep(true); // Устанавливаем флаг для второго шага
//       openContactForm(); // Переходим на второй шаг
//     } else {
//       alert(`Ошибки: ${errors.join('\n')}`); // Выводим ошибки валидации
//     }
//   });

//   eventEmitter.on<{ method: string }>('order:paymentMethodSelected', ({ method }) => {
//     order.setPaymentMethod(method);
//   });
// }

// // Функция для открытия формы второго шага
// function openContactForm() {
//   contactFormView.render();

//   // Привязываем события для второго шага
//   contactFormView.bindEvents(() => {
//     const { email, phone } = contactFormView.getData();
//     order.setEmail(email);
//     order.setPhone(phone);

//     const errors = order.validateOrder();
//     if (errors.length === 0) {
//       showOrderSuccess(); // Отображаем подтверждение заказа
//     } else {
//       alert(`Ошибки: ${errors.join('\n')}`); // Выводим ошибки валидации
//     }
//   });
// }

// function showOrderSuccess() {
//   const successTemplate = document.getElementById('success') as HTMLTemplateElement;
//   if (!successTemplate) {
//     throw new Error('Template with ID "success" not found');
//   }

//   const clone = successTemplate.content.cloneNode(true) as HTMLElement;
//   modalContent.innerHTML = ''; // Очищаем контент модального окна
//   modalContent.appendChild(clone);

//   // Сохраняем итоговую сумму перед очисткой корзины
//   const totalAmount = cart.calculateTotal();

//   // Обновляем текст с итоговой суммой
//   const totalAmountElement = modalContent.querySelector('.order-success__description');
//   if (totalAmountElement) {
//     totalAmountElement.textContent = `Списано ${totalAmount.toLocaleString()} синапсов`;
//   }

//   // Очищаем корзину после оформления заказа
//   cart.clearCart();
//   updateBasketCounter();

//   const closeButton = modalContent.querySelector('.order-success__close') as HTMLButtonElement;
//   if (closeButton) {
//     closeButton.addEventListener('click', () => {
//       modal.close(); // Закрываем модальное окно
//     });
//   }
// }

// // Привязываем событие к кнопке корзины
// const basketButton = document.querySelector('.header__basket');
// if (basketButton) {
//   basketButton.addEventListener('click', openCartModal);
// }

// // Функция для добавления товара в корзину
// function addToCart(product: Product) {
//   if (!cart.getItems().some(item => item.productId === product.id)) {
//     cart.addItem({
//       productId: product.id,
//       title: product.title,
//       price: product.price || 0, // Устанавливаем цену 0, если она null
//       category: product.category,
//     });
//     updateBasketCounter(); // Обновляем счетчик
//   }
// }

// // Функция для загрузки и отображения каталога
// async function loadCatalog() {
//   try {
//     const response = await api.get('/product');
//     const items = (response as { items: Product[] }).items;

//     catalog.setProducts(items); // Обновляем модель
//     const cards = items.map(createProductCard); // Создаем карточки
//     catalogView.renderCatalog(cards); // Отображаем карточки

//     catalogView.bindCardEvents(cards, handleCardClick); // Привязываем события
//   } catch (error) {
//     alert('Ошибка при загрузке каталога');
//   }
// }

// // Функция для получения CSS-класса категории
// function getCategoryClass(category: string): string {
//   const categoryMapping: Record<string, string> = {
//     'софт-скил': 'soft',
//     'хард-скил': 'hard',
//     'дополнительное': 'additional',
//     'кнопка': 'button',
//     'другое': 'other',
//   };

//   return categoryMapping[category.toLowerCase()] || category.toLowerCase();
// }

// function createProductCard(item: Product) {
//   const productCard = new ProductCard(
//     item.title,
//     `${CDN_URL}/${item.image}`,
//     item.price,
//     item.category
//   );

//   const cardElement = productCard.render();
//   setElementData(cardElement, { productId: item.id });

//   const categorySpan = cardElement.querySelector('.card__category') as HTMLElement;
//   if (categorySpan) {
//     categorySpan.className = `card__category card__category_${getCategoryClass(item.category)}`;
//   }

//   return cardElement;
// }


// // Обработчик кликов на карточках товаров
// function handleCardClick(event: Event) {
//   const target = event.target as HTMLElement;
//   const cardElement = target.closest('.gallery__item') as HTMLElement;
//   if (!cardElement) return;

//   const productId = cardElement.dataset.productId;
//   if (!productId) return;

//   const product = catalog.getProducts().find(product => product.id === productId);

//   if (!product) return;

//   eventEmitter.emit('product:selected', product);
// }

// // Обработчик события выбора продукта
// eventEmitter.on<Product>('product:selected', (product) => {
//   const renderedElement = productDetailView.render({
//     title: product.title,
//     price: product.price,
//     description: product.description,
//     category: product.category,
//     image: `${CDN_URL}/${product.image}`,
//   });

//   // Логика для установки цвета категории
//   const categorySpan = renderedElement.querySelector('.card__category') as HTMLElement;
//   if (categorySpan) {
//     categorySpan.className = `card__category card__category_${getCategoryClass(product.category)}`; // Назначаем класс
//   }

//   const button = modalContent.querySelector('.card__button') as HTMLButtonElement;
//   if (!button) {
//     return;
//   }

//   // Проверяем, добавлен ли товар в корзину
//   if (cart.getItems().some(item => item.productId === product.id)) {
//     button.textContent = 'Уже в корзине';
//     button.disabled = true;
//   }

//   // Привязываем событие напрямую
//   button.addEventListener('click', () => {
//     addToCart(product);
//     button.textContent = 'Уже в корзине';
//     button.disabled = true;
//   });

//   modal.open();
// });

// // Загружаем каталог при загрузке страницы
// document.addEventListener('DOMContentLoaded', loadCatalog);
