// Тип для данных продукта
export interface Product {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс каталога
export interface ICatalog {
  setProducts(products: Product[]): void;
  getProducts(): Product[];
}

// Типы данных для корзины
export interface ICartItem {
  productId: string;
  price: number;
  title: string;
  category: string;
}

// Типы данных для заказа
export interface OrderData {
  paymentMethod: string; // Способ оплаты
  deliveryAddress: string; // Адрес доставки
  phone: string; // Номер телефона
  email: string; // Адрес электронной почты
}

// Интерфейс корзины
export interface ICart {
  addItem(product: ICartItem): void; // Добавление товара в корзину
  removeItem(productId: string): void; // Удаление товара из корзины
  calculateTotal(): number; // Подсчёт общей стоимости товаров
  getItems(): ICartItem[]; // Получение списка товаров в корзине
}

// Интерфейс заказа
export interface IOrder {
  setPaymentMethod(method: string): void; // Установка способа оплаты
  setDeliveryAddress(address: string): void; // Установка адреса доставки
  setPhone(phone: string): void; // Установка номера телефона
  setEmail(email: string): void; // Установка email
}

// Интерфейс для класса CatalogView
export interface ICatalogView {
  container: HTMLElement; // Контейнер для рендера

  renderCatalog(cards: HTMLElement[]): void; // Метод для рендера каталога, принимает массив HTML-элементов карточек
  bindCardEvents(cards: HTMLElement[], eventHandler: (event: Event) => void): void; // Метод для привязки событий, принимает массив HTML-элементов карточек и обработчик событий
}

// Интерфейс для класса ProductDetailView
export interface IProductDetailView {
  render(product: { title: string; price: number; description: string; category: string; image: string }): HTMLElement; // Метод для создания и возврата разметки карточки товара
}


// Интерфейс для класса PaymentFormView
export interface IPaymentFormView {
  container: HTMLElement; // Контейнер для формы выбора оплаты
  paymentMethod: string | null; // Выбранный способ оплаты (строка)
  deliveryAddress: HTMLInputElement; // Введённый адрес доставки

  render(): void; // Рендер формы
  getData(): { paymentMethod: string; deliveryAddress: string }; // Получение данных формы
  bindEvents(onNext: () => void): void; // Привязка событий для перехода на следующий шаг
}

// Интерфейс для общего поля формы
export interface FormField {
  name: string; // Название поля
  type: 'text' | 'email' | 'tel'; // Тип поля
  label: string; // Подпись к полю
  required: boolean; // Обязательно ли к заполнению
}


// Интерфейс для класса ProductCard
export interface IProductCard {
  name: string; // Название товара
  image: string; // URL изображения
  price: number; // Цена товара
  category: string; // Раздел товара

  render(): HTMLElement; // Создание DOM-элемента карточки
  bindEvents(): void; // Привязка событий
}

// Интерфейс для класса Modal
export interface IModal {
  open(): void; // Открывает модальное окно
  close(): void; // Закрывает модальное окно
  addEventListeners(): void; // Добавляет обработчики событий

  _modalElement: HTMLElement; // Элемент модального окна
}

export interface ProductItem {
  image: string;
  title: string;
  category: string;
  price: number | null;
}
