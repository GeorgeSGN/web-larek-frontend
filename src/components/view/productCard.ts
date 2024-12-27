import { IProductCard } from "../../types";

export class ProductCard implements IProductCard {
  name: string;
  image: string;
  price: number;
  category: string;

  constructor(name: string, image: string, price: number, category: string) {
    this.name = name;
    this.image = image;
    this.price = price;
    this.category = category;
  }

  render(): HTMLElement {
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    if (!template || !template.content) {
      throw new Error('Template with ID "card-catalog" not found.');
    }

    const cardElement = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!cardElement) {
      throw new Error('Failed to clone card template.');
    }

    const categoryElement = cardElement.querySelector('.card__category') as HTMLElement;
    const titleElement = cardElement.querySelector('.card__title') as HTMLElement;
    const imageElement = cardElement.querySelector('.card__image') as HTMLImageElement;
    const priceElement = cardElement.querySelector('.card__price') as HTMLElement;

    if (categoryElement) {
      categoryElement.textContent = this.category;
    }

    if (titleElement) {
      titleElement.textContent = this.name;
    }

    if (imageElement) {
      imageElement.src = this.image;
      imageElement.alt = this.name;
    }

    if (priceElement) {
      priceElement.textContent = `${this.price} синапсов`;
    }

    return cardElement;
  }

  bindEvents(): void {
    //  Будет заполняться логикой презентера
  }
}
