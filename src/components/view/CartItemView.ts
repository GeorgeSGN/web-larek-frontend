import { EventEmitter } from '../base/events';
import { ICartItem } from '../../types';

/**
 * Класс CartItemView отвечает за отрисовку одного элемента списка корзины.
 * Он клонирует шаблон (#card-basket), вставляет данные
 * и инициирует кнопку удаления через EventEmitter.
 */
export class CartItemView {
  private element: HTMLElement;

  constructor(
    private item: ICartItem,
    private eventEmitter: EventEmitter,
    private index?: number
  ) {
    // Шаблон #card-basket
    const template = document.getElementById('card-basket') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "card-basket" not found');
    }

    // Клонируем
    const clone = template.content.cloneNode(true) as HTMLElement;

    // Ищем .basket__item в клоне
    const liElement = clone.querySelector('.basket__item') as HTMLElement;
    if (!liElement) {
      throw new Error('basket__item not found inside #card-basket template');
    }

    this.element = liElement;

    // Заполняем index
    if (typeof this.index === 'number') {
      const indexEl = liElement.querySelector('.basket__item-index') as HTMLElement;
      if (indexEl) {
        indexEl.textContent = String(this.index);
      }
    }

    // Заполняем title
    const titleEl = liElement.querySelector('.card__title') as HTMLElement;
    if (titleEl) {
      titleEl.textContent = this.item.title;
    }

    // Заполняем price
    const priceEl = liElement.querySelector('.card__price') as HTMLElement;
    if (priceEl) {
      priceEl.textContent = `${(this.item.price || 0).toLocaleString()} синапсов`;
    }

    // data-product-id
    liElement.dataset.productId = this.item.productId;

    // Кнопка удаления
    const deleteButton = liElement.querySelector('.basket__item-delete') as HTMLElement;
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        // Вместо removeItem(...) — эмитим событие
        this.eventEmitter.emit('cart:remove', { productId: this.item.productId });
      });
    }
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
