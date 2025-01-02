import { Product } from '../../types';
import { setElementData } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { CDN_URL } from '../../utils/constants';


export class ProductCard {
  private product: Product;
  private element: HTMLElement;
  private eventEmitter: EventEmitter;

  constructor(product: Product, eventEmitter: EventEmitter) {
    this.product = product;
    this.eventEmitter = eventEmitter;

    // 1. Находим #card-catalog
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "card-catalog" not found');
    }

    // 2. Клонируем
    const clone = template.content.cloneNode(true) as HTMLElement;

    // 3. Находим корневой элемент
    const cardElement = clone.querySelector('.gallery__item');
    if (!cardElement || !(cardElement instanceof HTMLElement)) {
      throw new Error('Root .gallery__item element not found or not HTMLElement in #card-catalog');
    }

    this.element = cardElement;

    // 4. Заполняем поля
    this.setTitle(this.product.title);
    this.setPrice(this.product.price || 0);
    this.setImage(this.product.image);
    this.setCategory(this.product.category);

    // 5. Data-атрибут
    setElementData(this.element, { productId: this.product.id });

    this.element.addEventListener('click', () => {
      this.eventEmitter.emit('product:selected', this.product);
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private setTitle(title: string) {
    const titleEl = this.element.querySelector('.card__title') as HTMLElement;
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  private setPrice(price: number) {
    const priceEl = this.element.querySelector('.card__price') as HTMLElement;
    if (priceEl) {
      priceEl.textContent = `${price.toLocaleString()} синапсов`;
    }
  }

  private setImage(imageName: string) {
    const imgEl = this.element.querySelector('.card__image') as HTMLImageElement;
    if (imgEl) {
      imgEl.src = `${CDN_URL}/${imageName}`;
      imgEl.alt = this.product.title;
    }
  }

  private setCategory(category: string) {
    const categorySpan = this.element.querySelector('.card__category') as HTMLElement;
    if (categorySpan) {
      categorySpan.className = `card__category card__category_${this.getCategoryClass(category)}`;
      categorySpan.textContent = category;
    }
  }

  // Встроим "getCategoryClass" внутрь
  private getCategoryClass(category: string): string {
    const mapping: Record<string, string> = {
      'софт-скил': 'soft',
      'хард-скил': 'hard',
      'дополнительное': 'additional',
      'кнопка': 'button',
      'другое': 'other',
    };
    return mapping[category.toLowerCase()] || category.toLowerCase();
  }
}
