import { IProductDetailView } from '../../types/index';

/**
 * Класс ProductDetailView управляет отображением информации о конкретном товаре
 * в модальном окне, используя HTML-шаблон #card-preview.
 */
export class ProductDetailView implements IProductDetailView {
  private element: HTMLElement;   // Храним корневой элемент
  private addToCartButton: HTMLButtonElement | null = null;

  constructor() {
    this.element = document.createElement('div'); 
  }

  /**
   * Отображает информацию о товаре в контейнере, используя HTML-шаблон.
   * @param product - объект с данными о товаре (название, цена, описание, категория, изображение).
   */
  public render(product: {
    title: string;
    price: number | null;
    description: string;
    category: string;
    image: string;
  }): HTMLElement {
    const template = document.getElementById('card-preview') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "card-preview" not found');
    }

    // Клонируем содержимое шаблона
    const clone = template.content.cloneNode(true) as HTMLElement;

    // --- Заполняем данные ---

    // Изображение
    const imageElement = clone.querySelector('.card__image') as HTMLImageElement;
    if (imageElement) {
      imageElement.src = product.image;
      imageElement.alt = product.title;
    }

    // Категория (текст и класс)
    const categoryElement = clone.querySelector('.card__category') as HTMLElement;
    if (categoryElement) {
      // Ставим сам текст категории
      categoryElement.textContent = product.category;

      const catClass = this.getCategoryClass(product.category);
      categoryElement.className = `card__category card__category_${catClass}`;
    }

    // Название
    const titleElement = clone.querySelector('.card__title');
    if (titleElement) {
      titleElement.textContent = product.title;
    }

    // Описание
    const descriptionElement = clone.querySelector('.card__text');
    if (descriptionElement) {
      descriptionElement.textContent = product.description;
    }

    // Цена
    const priceElement = clone.querySelector('.card__price');
      if (priceElement) {
        // Если price === null, используем 0
        const safePrice = product.price ?? 0;
        priceElement.textContent = `${safePrice.toLocaleString()} синапсов`;
      }

    this.addToCartButton = clone.querySelector('.card__button') as HTMLButtonElement | null;

    // Очищаем контейнер и добавляем заполненную разметку
    this.element.innerHTML = '';
    this.element.appendChild(clone);

    return this.element;
  }

  /**
   * Вызываем, чтобы назначить обработчик "Добавить в корзину".
   * Кнопка относится к блоку "Детали продукта".
   * 
   * @param onAddToCart — колбэк, вызываемый при клике
   */
  public bindAddToCart(onAddToCart: () => void): void {
    if (!this.addToCartButton) return; // значит, render() ещё не вызывали
    this.addToCartButton.addEventListener('click', onAddToCart);
  }

  /**
   * (7) Метод, управляющий состоянием кнопки (в корзине / не в корзине).
   */
  public setIsInCart(inCart: boolean): void {
    if (!this.addToCartButton) return;
    if (inCart) {
      this.addToCartButton.textContent = 'Уже в корзине';
      this.addToCartButton.disabled = true;
    } else {
      this.addToCartButton.textContent = 'В корзину';
      this.addToCartButton.disabled = false;
    }
  }

  private getCategoryClass(category: string): string {
    const categoryMapping: Record<string, string> = {
      'софт-скил': 'soft',
      'хард-скил': 'hard',
      'дополнительное': 'additional',
      'кнопка': 'button',
      'другое': 'other',
    };
    return categoryMapping[category.toLowerCase()] || category.toLowerCase();
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
