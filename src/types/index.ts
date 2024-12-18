// Типы для API. Очень рассчитываю на ревью :) 
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get(uri: string): Promise<object>;
  post(uri: string, data: object, method?: ApiPostMethods): Promise<object>;
  handleResponse(response: Response): Promise<object>;
}

// Типы событий и подписчиков
export type EventName = string | RegExp;
export type Subscriber = (event: object) => void;

export interface EmitterEvent {
  name: string;
  data?: object;
}

export interface IEventEmitter {
  on<T extends object>(eventName: EventName, callback: (event: T) => void): void;
  off(eventName: EventName, callback: Subscriber): void;
  emit<T extends object>(eventName: string, data?: T): void;
  onAll(callback: (event: EmitterEvent) => void): void;
  offAll(): void;
  trigger<T extends object>(eventName: string, context?: Partial<T>): (event: T) => void;
}

// Тип для данных продукта
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

// Интерфейс каталога
export interface ICatalog {
  setProducts(products: Product[]): void;
  getProducts(): Product[];
}

// Типы данных для корзины
export interface CartItem {
  productId: string;
  quantity: number;
}

// Типы данных для заказа
export interface OrderData {
  paymentMethod: string;
  deliveryAddress: string;
}

// Интерфейс корзины
export interface ICart {
  addItem(product: CartItem): void;
  removeItem(productId: string): void;
  calculateTotal(): number;
  getItems(): CartItem[];
}

// Интерфейс заказа
export interface IOrder {
  setPaymentMethod(method: string): void;
  setDeliveryAddress(address: string): void;
  validateOrder(): string[];
}

// Интерфейс для класса CatalogView
export interface ICatalogView {
  container: HTMLElement; // Контейнер для рендера

  renderCatalog(cards: HTMLElement[]): void; // Метод для рендера каталога, принимает массив HTML-элементов карточек
  bindCardEvents(cards: HTMLElement[]): void; // Метод для привязки событий, принимает массив HTML-элементов карточек
}

// Интерфейс для класса ProductDetailView
export interface IProductDetailView {
  product: Product; // Товар для отображения
  container: HTMLElement; // Контейнер для отображения разметки

  render(): HTMLElement; // Метод для создания разметки
  bindEvents(onBuy: () => void, onRemove: () => void): void; // Привязка событий
}

// Интерфейс для класса PaymentFormView
export interface IPaymentFormView {
  container: HTMLElement; // Контейнер для формы выбора оплаты
  paymentMethod: string; // Выбранный способ оплаты
  deliveryAddress: string; // Введённый адрес доставки

  render(): void; // Рендер формы
  validate(): boolean; // Проверка заполненности полей
  getData(): { paymentMethod: string; deliveryAddress: string }; // Получение данных формы
  bindEvents(onNext: () => void): void; // Привязка событий для перехода на следующий шаг
}

// Интерфейс для класса ContactFormView
export interface IContactFormView {
  container: HTMLElement; // Контейнер для формы контактных данных
  email: string; // Введённый email
  phone: string; // Введённый номер телефона

  render(): void; // Рендер формы
  validate(): boolean; // Проверка заполненности полей
  getData(): { email: string; phone: string }; // Получение данных формы
  bindEvents(onSubmit: () => void): void; // Привязка событий для завершения оформления заказа
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
  imageUrl: string; // URL изображения
  price: number; // Цена товара
  tag: string; // Раздел товара

  render(): HTMLElement; // Создание DOM-элемента карточки
  bindEvents(): void; // Привязка событий
}

// Интерфейс для класса Modal
export interface IModal {
  open(): void; // Открывает модальное окно
  close(): void; // Закрывает модальное окно
  addEventListeners(): void; // Добавляет обработчики событий

  _modalElement: HTMLElement; // Элемент модального окна
  _content: string | HTMLElement; // Контент модального окна
}

// Интерфейс для товара в корзине
export interface CartItem {
  id: number; // Уникальный идентификатор товара
  name: string; // Название товара
  price: number; // Цена товара
}

// Интерфейс для класса CartView
export interface ICartView {
  renderCart(items: HTMLElement[]): void; // Рендер списка товаров в корзине
  bindItemEvents(items: HTMLElement[]): void; // Привязка обработчиков событий к товарам
}

