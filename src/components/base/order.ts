import { IOrder } from "../../types";

/**
 * Класс Order управляет оформлением заказа, включая данные из формы. Содержит информацию о способе оплаты, адресе доставки, телефоне и email.
 */
export class Order implements IOrder {
  private paymentMethod: string; // Способ оплаты
  private deliveryAddress: string; // Адрес доставки
  private phone: string;
  private email: string;

  /**
   * Конструктор инициализирует заказ c пустыми данными.
   */
  constructor() {
    this.paymentMethod = '';
    this.deliveryAddress = '';
    this.phone = '';
    this.email = '';
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
   * Получает способ оплаты.
   * @returns строка, представляющая способ оплаты
   */
  getPaymentMethod(): string {
    return this.paymentMethod;
  }

  /**
   * Получает адрес доставки.
   * @returns строка, представляющая адрес доставки
   */
  getDeliveryAddress(): string {
    return this.deliveryAddress;
  }

  /**
   * Получает номер телефона.
   * @returns строка, представляющая номер телефона
   */
  getPhone(): string {
    return this.phone;
  }

  /**
   * Получает адрес электронной почты.
   * @returns строка, представляющая email
   */
  getEmail(): string {
    return this.email;
  }

  validateFirstStep(): string[] {
    const errors: string[] = [];
    if (!this.paymentMethod) errors.push('Укажите способ оплаты.');
    if (!this.deliveryAddress) errors.push('Укажите адрес доставки.');
    return errors;
  }

  validateSecondStep(): string[] {
    const errors: string[] = [];
    if (!this.phone || !/^\+?[0-9\s-]{7,15}$/.test(this.phone)) {
      errors.push('Введите корректный номер телефона.');
    }
    if (!this.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email)) {
      errors.push('Введите корректный email.');
    }
    return errors;
  }
  
}