import { ICartView } from '../../types';

/**
 * Класс CartView управляет отображением корзины товаров, включая список товаров,
 * общую стоимость и кнопку для оформления заказа, используя HTML-шаблон.
 */
export class CartView implements ICartView {
  container: HTMLElement;
  totalElement: HTMLElement | null;
  submitButton: HTMLButtonElement | null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.totalElement = null;
    this.submitButton = null;
  }

  /**
   * Рендерит корзину с переданными элементами товаров, используя HTML-шаблон.
   * @param items - массив HTML-элементов, представляющих товары.
   */
  renderCart(items: HTMLElement[]): void {
    const template = document.getElementById('basket') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "basket" not found');
    }

    // Клонируем содержимое шаблона
    const clone = template.content.cloneNode(true) as HTMLElement;

    // Находим список товаров и добавляем в него переданные элементы
    const listElement = clone.querySelector('.basket__list');
    if (listElement) {
      listElement.replaceChildren(...items);
    }

    // Очищаем контейнер и добавляем корзину
    this.container.innerHTML = '';
    this.container.appendChild(clone);

    // Сохраняем элементы для обновления
    this.totalElement = this.container.querySelector('.basket__price');
    this.submitButton = this.container.querySelector('.button');
  }

  /**
   * Привязывает обработчики событий к переданным карточкам товаров.
   * @param items - массив HTML-элементов, представляющих товары.
   */
  bindItemEvents(items: HTMLElement[]): void {
    items.forEach((item) => {
      const deleteButton = item.querySelector('.basket__item-delete');
      if (deleteButton) {
        deleteButton.addEventListener('click', () => {
          item.remove();
          this.updateTotal();
        });
      }
    });
  }

  /**
   * Обновляет отображение общей стоимости товаров в корзине.
   * Метод предполагает, что каждая карточка товара содержит элемент с ценой.
   */
  private updateTotal(): void {
    if (!this.totalElement) return;

    const items = this.container.querySelectorAll('.basket__item');
    let total = 0;

    items.forEach((item) => {
      const priceElement = item.querySelector('.card__price');
      if (priceElement) {
        const priceText = priceElement.textContent || '0';
        const price = parseFloat(priceText.replace(/\D+/g, ''));
        total += isNaN(price) ? 0 : price;
      }
    });

    this.totalElement.textContent = `${total.toLocaleString()} синапсов`;

    if (this.submitButton) {
      this.submitButton.disabled = items.length === 0;
    }
  }
}
