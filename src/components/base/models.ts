import { Product, ICatalog, CartItem, ICart, IOrder } from "../../types/index";

/**
 * Класс Catalog управляет данными каталога товаров.
 * Отвечает за хранение, обновление и предоставление данных о товарах.
 */
export class Catalog implements ICatalog {
  // Массив объектов товаров
  private products: Product[] = [];

  /**
   * Конструктор инициализирует каталог c пустым массивом товаров. 
   */
  constructor() {
    this.products = [];
  }

  /**
   * Устанавливает список товаров в каталог.
   * @param products - массив объектов товаров.
   */
  setProducts(products: Product[]): void {
    this.products = products;
  }

  /**
   * Возвращает текущий список товаров из каталога.
   * @returns массив объектов товаров
   */
  getProducts(): Product[] {
    return this.products;
  }
}

/**
 * Класс Cart управляет данными корзины, включая добавление, удаление и вычисление итоговой стоимости товаров.
 */
export class Cart implements ICart {
  private items: CartItem[] = []; // Массив объектов корзины

  /**
   * Конструктор инициализирует корзину c пустым массивом товаров.
   */
  constructor() {
    this.items = [];
  }

  /** Добавляет товар в корзину
   * @param product - объект товара для добавления
   */
  addItem(product: CartItem): void {
    this.items.push(product);
  }

  /** 
   * Удаляет товар из корзины по его ID
   * @param productId - ID товара, который нужно удалить.
   */
  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.productId !== productId);
  }

  /**
   * Вычисляет общую стоимость всех товаров в корзине.
   * @returns общая стоимость товаров
   */
  calculateTotal(): number {
    return this.items.reduce((total, item) => total + item.price, 0)
  }

  /** 
   * Возвращает массив текущих товаров в корзине.
   * @returns массив объектов корзины
   */
  getItems(): CartItem[] {
    return [...this.items]
  }

  /** 
   * Очищает корзину, удаляя все товары. 
   */
  clearCart(): void {
    this.items = [];
  }
}

/**
 * Класс Order управляет оформлением заказа, включая данные из формы. Содержит информацию о способе оплаты, адресе доставки, телефоне и email.
 */
export class Order implements IOrder {
  private paymentMethod: string; // Способ оплаты
  private deliveryAddress: string; // Адрес доставки
  private phone: string;
  private email: string;
  private isSecondStep: boolean; // Флаг для второго шага оформления заказа

  /**
   * Конструктор инициализирует заказ c пустыми данными.
   */
  constructor() {
    this.paymentMethod = '';
    this.deliveryAddress = '';
    this.phone = '';
    this.email = '';
    this.isSecondStep = false; // На первом шаге
  }

  /**
   * Устанавливает способ оплаты.
   * @param method - строка, представляющая способ оплаты
   */
  setPaymentMethod(method: string): void {
    this.paymentMethod = method;
  }

  /**
   * Устанавливает адрес доставки.
   * @param address - строка, представляющая адрес доставки
   */
  setDeliveryAddress(address: string): void {
    this.deliveryAddress = address;
  }

  /**
   * Устанавливает номер телефона.
   * @param phone - строка, представляющая номер телефона
   */
  setPhone(phone: string): void {
    this.phone = phone;
  }

  /**
   * Устанавливает адрес электронной почты.
   * @param email - строка, представляющая email
   */
  setEmail(email: string): void {
    this.email = email;
  }

  /**
   * Устанавливает флаг для второго шага (для валидации телефона и email)
   * @param isSecondStep - флаг, указывающий на второй шаг
   */
  setIsSecondStep(isSecondStep: boolean): void {
    this.isSecondStep = isSecondStep;
  }

  /** Проверяет корректность данных заказа
   * @returns массив строк с ошибками или пустой массив, если всё корректно
   */
  validateOrder(): string[] {
    const errors: string[] = [];

    if (!this.paymentMethod) errors.push('Способ оплаты не указан.');
    if (!this.deliveryAddress) errors.push('Адрес доставки не указан.');

    // Валидация для второго шага
    if (this.isSecondStep) {
      if (!this.phone || !/^\+?[0-9\s-]{7,15}$/.test(this.phone)) {
        errors.push('Некорректный номер телефона.');
      }
      if (!this.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email)) {
        errors.push('Некорректный email.');
      }
    }

    return errors;
  }
}

