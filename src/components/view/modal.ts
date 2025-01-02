import { IModal } from "../../types";

export class Modal implements IModal {
  _modalElement: HTMLElement;

  constructor() {
    const modalElement = document.getElementById('modal-container');
    if (!modalElement) {
      throw new Error('Modal container element not found in DOM');
    }
    this._modalElement = modalElement;
  }

  /**
   * Устанавливает содержимое модального окна
   * Для открытия вызывается open().
   */
  public setContent(content: string | HTMLElement): void {
    const contentContainer = this._modalElement.querySelector('.modal__content');
    if (!contentContainer) {
      throw new Error('Content container not found in modal');
    }

    // Очищаем перед добавлением
    contentContainer.innerHTML = '';

    if (typeof content === 'string') {
      contentContainer.innerHTML = content;
    } else {
      // Если пришёл HTMLElement, вставляем его
      contentContainer.appendChild(content);
    }
  }

  public open(): void {
    // Превращаем контейнер в видимый "оверлей"
    this._modalElement.classList.add('modal_active');
    this._modalElement.style.position = 'fixed';
    this._modalElement.style.top = '0';
    this._modalElement.style.left = '0';
    this._modalElement.style.width = '100vw';
    this._modalElement.style.height = '100vh';

    // Вешаем слушатели на закрытие
    this.addEventListeners();
  }

  public close(): void {
    this._modalElement.classList.remove('modal_active');

    // Сбрасываем стили
    this._modalElement.style.position = '';
    this._modalElement.style.top = '';
    this._modalElement.style.left = '';
    this._modalElement.style.width = '';
    this._modalElement.style.height = '';
  }

  addEventListeners(): void {
    const closeButton = this._modalElement.querySelector('.modal__close');

    if (closeButton) {
      closeButton.addEventListener('click', () => this.close(), { once: true });
      // once: true - чтобы при каждом открытии заново не плодились слушатели
    }

    this._modalElement.addEventListener('click', (event) => {
      if (event.target === this._modalElement) {
        this.close();
      }
    }, { once: true });
  }
}

