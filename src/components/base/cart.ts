import { ICart, ICartItem } from "../../types";

/**
 * Класс Cart управляет данными корзины, включая добавление, удаление и вычисление итоговой стоимости товаров.
 */
export class Cart implements ICart {
  private items: ICartItem[] = []; // Массив объектов корзины

  /**
   * Конструктор инициализирует корзину c пустым массивом товаров.
   */
  constructor() {
    this.items = [];
  }

  /** Добавляет товар в корзину
   * @param product - объект товара для добавления
   */
  addItem(product: ICartItem): void {
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
  getItems(): ICartItem[] {
    return [...this.items]
  }

  /** 
   * Очищает корзину, удаляя все товары. 
   */
  clearCart(): void {
    this.items = [];
  }
}