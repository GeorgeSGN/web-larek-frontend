import { EventEmitter } from '../base/events';
import { CartItemView } from './CartItemView';
import { ICartItem } from '../../types';

/**
 * Класс CartView отвечает за отображение корзины и взаимодействие с пользователем.
 */
export class CartView {
  private element: HTMLElement;
  private listElement: HTMLElement;
  private totalPriceElement: HTMLElement;
  private checkoutButton: HTMLButtonElement;

  private eventEmitter: EventEmitter;

  // Новые поля, где храним данные корзины
  private items: ICartItem[] = [];
  private total = 0;

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

    // Слушатель на кнопку «Оформить»
    this.checkoutButton.addEventListener('click', () => {
      this.eventEmitter.emit('cart:checkout');
    });
  }

  /**
   * (1) Публичный "set"‐метод, который сохраняет новые данные (items + total)
   * и затем вызывает внутренний рендер.
   */
  public setData(items: ICartItem[], total: number): void {
    this.items = items;
    this.total = total;
    this.render();
  }

  /**
   * (2) Рендерим корзину заново, используя поля `this.items` и `this.total`.
   */
  private render(): void {
    // 1. Очищаем список перед перерисовкой
    this.listElement.innerHTML = '';

    // 2. Для каждого элемента массива создаём CartItemView
    this.items.forEach((item, index) => {
      const cartItemView = new CartItemView(item, this.eventEmitter, index + 1);
      this.listElement.appendChild(cartItemView.getElement());
    });

    // 3. Обновляем общую стоимость
    this.totalPriceElement.textContent = `${this.total.toLocaleString()} синапсов`;

    // 4. Управляем кнопкой «Оформить»: если 0 товаров, disabled = true
    this.checkoutButton.disabled = (this.items.length === 0);
  }

  /**
   * Возвращает корневой элемент корзины (<div class="basket">),
   * который можно вставить в модалку через setContent(...).
   */
  public getElement(): HTMLElement {
    return this.element;
  }
}
