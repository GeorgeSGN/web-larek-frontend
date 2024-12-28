import { EventEmitter } from '../base/events';
import { CartItem } from '../../types';

/**Cart
 * Класс CartItemView отвечает за отрисовку одного элемента списка корзины.
 * Он клонирует шаблон (#card-basket), вставляет данные
 * и инициирует кнопку удаления через EventEmitter.
 */
export class CartItemView {
  private item: CartItem;
  private element: HTMLElement;
  private eventEmitter: EventEmitter;

  constructor(item: CartItem, eventEmitter: EventEmitter) {
    this.item = item;
    this.eventEmitter = eventEmitter;

    // Ищем шаблон #card-basket
    const template = document.getElementById('card-basket') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "card-basket" not found');
    }

    // Клонируем содержимое шаблона
    const clone = template.content.cloneNode(true) as HTMLElement;

    // Сохраняем корневой элемент <li>
    this.element = clone.querySelector('.basket__item') as HTMLElement;
    if (!this.element) {
      throw new Error('basket__item not found inside #card-basket template');
    }

    // Заполняем данные о товаре
    const titleEl = this.element.querySelector('.card__title') as HTMLElement;
    if (titleEl) {
      titleEl.textContent = item.title;
    }

    const priceEl = this.element.querySelector('.card__price') as HTMLElement;
    if (priceEl) {
      priceEl.textContent = `${(item.price || 0).toLocaleString()} синапсов`;
    }

    // Проставляем data-product-id
    this.element.dataset.productId = item.productId;

    // Вешаем обработчик на кнопку удаления
    const deleteButton = this.element.querySelector('.basket__item-delete') as HTMLElement;
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        // Вместо прямого cart.removeItem — эмитим событие
        this.eventEmitter.emit('cart:remove', { productId: this.item.productId });
      });
    }
  }

  /**
   * Возвращаем готовый <li> элемент
   */
  public getElement(): HTMLElement {
    return this.element;
  }
}
