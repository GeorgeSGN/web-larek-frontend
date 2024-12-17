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
  fetchProducts(): Promise<Product[]>;
  getProducts(): Product[];
}

// Типы данных заказа
export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface OrderData {
  items: OrderItem[];
  paymentMethod: string;
  deliveryAddress: string;
}

// Интерфейс для управления заказом
export interface IOrder {
  addItem(productId: string): void;
  removeItem(productId: string): void;
  getItems(): OrderItem[];
  setPaymentMethod(method: string): void;
  setDeliveryAddress(address: string): void;
  validateOrder(): string[];
}

// Интерфейс для класса CatalogView
export interface ICatalogView {
  catalog: Product[]; // Массив товаров для отображения
  container: HTMLElement; // Контейнер для рендера

  renderCatalog(): void; // Метод для рендера каталога
  bindCardEvents(): void; // Метод для привязки событий
}

// Интерфейс для класса ProductDetailView
export interface IProductDetailView {
  product: Product; // Товар для отображения
  container: HTMLElement; // Контейнер для отображения разметки

  render(): HTMLElement; // Метод для создания разметки
  bindEvents(onBuy: () => void, onRemove: () => void): void; // Привязка событий
}

// Интерфейс для класса OrderFormView
export interface IOrderFormView {
  container: HTMLElement; // Контейнер для формы
  currentStep: number; // Текущий шаг оформления заказа
  formData: {
    [key: string]: string | number;
  };
 // Данные формы

  renderStep(stepIndex: number): void; // Рендер шага
  validateStep(stepIndex: number): boolean; // Валидация текущего шага
  bindEvents(onSubmit: () => void): void; // Привязка событий
  clearForm(): void; // Очистка формы
}

// Интерфейс для шага формы заказа
export interface OrderFormStep {
  id: string; // Уникальный идентификатор шага
  fields: FormField[]; // Поля шага
}

// Интерфейс для поля формы
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
  cartItems: CartItem[]; // Список товаров в корзине
  totalPrice: number; // Общая сумма товаров
  modal: IModal; // Экземпляр модального окна

  addItem(item: CartItem): void; // Добавление товара в корзину
  removeItem(itemId: number): void; // Удаление товара из корзины
  calculateTotal(): number; // Подсчёт общей суммы
  renderCartItems(): HTMLElement; // Создание разметки корзины
  openCart(): void; // Открытие корзины в модальном окне
  closeCart(): void; // Закрытие корзины
  bindEvents(): void; // Привязка обработчиков событий
}

