import { CartItem } from '../../types';
import { CartItemView } from './CartItemView';
import { EventEmitter } from '../base/events';

/**
 * Класс CartView управляет отображением корзины товаров.
 * Он:
 *  1) Клонирует шаблон #basket (обёртка, ul, кнопка)
 *  2) Для каждого CartItem создаёт CartItemView
 *  3) Обновляет сумму и кнопку "Оформить"
 */
export class CartView {
  private container: HTMLElement;
  private totalElement: HTMLElement | null;
  private submitButton: HTMLButtonElement | null;
  private template: HTMLTemplateElement;
  private eventEmitter: EventEmitter;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    this.container = container;
    this.eventEmitter = eventEmitter;
    this.totalElement = null;
    this.submitButton = null;

    // Шаблон #basket
    const template = document.getElementById('basket') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "basket" not found');
    }

    this.template = template;
  }

  /**
   * Рендерим корзину (ul + items + кнопка "Оформить" + цена).
   * Принимаем массив cartItems (данные), и total (число).
   */
  public updateCart(cartItems: CartItem[], total: number): void {
    // 1. Клонируем #basket
    const clone = this.template.content.cloneNode(true) as HTMLElement;

    // 2. Находим ul.basket__list
    const listElement = clone.querySelector('.basket__list');
    if (!listElement) {
      throw new Error('.basket__list not found in #basket template');
    }

    // 3. Для каждого cartItem создаём CartItemView
    //    и добавляем в ul
    cartItems.forEach((itemData, index) => {
      const itemView = new CartItemView(itemData, this.eventEmitter);
      const li = itemView.getElement();

      // При желании, если надо показывать индекс:
      const indexEl = li.querySelector('.basket__item-index');
      if (indexEl) {
        indexEl.textContent = String(index + 1);
      }

      listElement.appendChild(li);
    });

    // 4. Обновляем общую стоимость
    const totalElement = clone.querySelector('.basket__price') as HTMLElement;
    if (totalElement) {
      totalElement.textContent = `${total.toLocaleString()} синапсов`;
    }
    this.totalElement = totalElement;

    // 5. Кнопка "Оформить"
    this.submitButton = clone.querySelector('.basket__button') as HTMLButtonElement;
    if (this.submitButton) {
      this.submitButton.addEventListener('click', () => {
        this.eventEmitter.emit('cart:checkout');
      });
    }

    // 6. Очищаем контейнер, вставляем новую корзину
    this.container.innerHTML = '';
    this.container.appendChild(clone);
  }
}
