import { Product } from '../../types';
import { setElementData } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

export class ProductCard {
  private product: Product;
  private element: HTMLElement;

  constructor(product: Product) {
    this.product = product;

    // 1. Находим #card-catalog (шаблон?)
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "card-catalog" not found');
    }

    // 2. Клонируем
    const clone = template.content.cloneNode(true) as HTMLElement;

    // 3. Находим корневой элемент ('.gallery__item' или '.card' — зависит от шаблона)
    const cardElement = clone.querySelector('.gallery__item');
    if (!cardElement) {
      throw new Error('Root .card element not found inside #card-catalog');
    }
    if (!(cardElement instanceof HTMLElement)) {
      throw new Error('not an HTMLElement');
    }

    this.element = cardElement;

    // 4. Заполняем поля
    this.setTitle(this.product.title);
    this.setPrice(this.product.price || 0);
    this.setImage(this.product.image);
    this.setCategory(this.product.category);

    // 5. Data-атрибут
    setElementData(this.element, { productId: this.product.id });
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
