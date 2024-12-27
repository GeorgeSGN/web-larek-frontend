// /components/catalogView.ts
import { ICatalogView } from '../../types/index';

export class CatalogView implements ICatalogView {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  // Метод для рендера каталога товаров
  renderCatalog(cards: HTMLElement[]): void {
    this.container.innerHTML = '';  // Очищаем контейнер
    cards.forEach(card => this.container.appendChild(card));  // Рендерим карточки
  }

  // Метод для привязки событий
  bindCardEvents(cards: HTMLElement[], eventHandler: (event: Event) => void): void {
    cards.forEach(card => {
      card.addEventListener('click', eventHandler);  // Передаем обработчик события
    });
  }
}
