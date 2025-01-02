import { EventEmitter } from '../base/events';
import { ICartItem } from '../../types';

/**
 * Класс CartView отвечает за отображение корзины и взаимодействие с пользователем.
 */
export class CartView {
  private element: HTMLElement;
  private listElement: HTMLElement;
  private totalPriceElement: HTMLElement;
  private checkoutButton: HTMLButtonElement;
  private itemTemplate: HTMLTemplateElement;
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;

    // Шаблон #basket
    const template = document.getElementById('basket') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "basket" not found');
    }

    const clone = template.content.cloneNode(true) as HTMLElement;
    this.element = clone.querySelector('.basket') as HTMLElement;
    if (!this.element) {
      throw new Error('Basket element not found in template');
    }

    this.listElement = this.element.querySelector('.basket__list') as HTMLElement;
    this.totalPriceElement = this.element.querySelector('.basket__price') as HTMLElement;
    this.checkoutButton = this.element.querySelector('.basket__button') as HTMLButtonElement;

    this.itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
    if (!this.itemTemplate) {
      throw new Error('Template with ID "card-basket" not found');
    }

    this.checkoutButton.addEventListener('click', () => {
      this.eventEmitter.emit('cart:checkout');
    });

  }

  /**
  /**
   * Обновляет отображение корзины.
   * @param total - общая стоимость товаров.
   * @param itemMarkup - готовая разметка списка товаров.
   */
  public updateCart(itemMarkup: DocumentFragment, total: number): void {
    this.renderCartItems(itemMarkup);
    this.updateTotalPrice(total);
    this.updateCheckoutButtonState(total > 0);
  }

   /**
   * Вставляет готовую разметку в блок списка товаров.
   * @param itemMarkup - разметка для вставки.
   */
   private renderCartItems(itemMarkup: DocumentFragment): void {
    this.listElement.innerHTML = '';
    this.listElement.appendChild(itemMarkup);
  }

  /**
   * Обновляет общую стоимость товаров.
   * @param total - общая стоимость.
   */
  private updateTotalPrice(total: number): void {
    this.totalPriceElement.textContent = `${total.toLocaleString()} синапсов`;
  }

  /**
   * Управляет состоянием кнопки «Оформить».
   * @param isEnabled - активна ли кнопка.
   */
  private updateCheckoutButtonState(isEnabled: boolean): void {
    this.checkoutButton.disabled = !isEnabled;
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
