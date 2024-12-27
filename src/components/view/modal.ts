import { IModal } from "../../types";

export class Modal implements IModal {
  _modalElement: HTMLElement;
  _content: string | HTMLElement;

  constructor(content: string | HTMLElement) {
    this._content = content;
    const modalElement = document.getElementById('modal-container');
    if (!modalElement) {
      throw new Error('Modal container element not found in DOM');
    }
    this._modalElement = modalElement;
  }

  open(): void {
    const contentContainer = this._modalElement.querySelector('.modal__content');
    if (!contentContainer) {
      throw new Error('Content container not found in modal');
    }

    if (typeof this._content === 'string') {
      contentContainer.innerHTML = this._content;
    } else {
      if (!contentContainer.contains(this._content)) {
        contentContainer.innerHTML = ''; // Очистка перед добавлением
        contentContainer.appendChild(this._content);
      }
    }

    // Устанавливаем фиксированное позиционирование
    this._modalElement.style.position = 'fixed';
    this._modalElement.style.top = '0';
    this._modalElement.style.left = '0';
    this._modalElement.style.width = '100vw';
    this._modalElement.style.height = '100vh';

    this._modalElement.classList.add('modal_active');
    this.addEventListeners();
  }

  close(): void {
    this._modalElement.classList.remove('modal_active');
    const contentContainer = this._modalElement.querySelector('.modal__content');
    if (contentContainer) {
      contentContainer.innerHTML = '';
    }

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
      closeButton.addEventListener('click', () => this.close());
    }

    this._modalElement.addEventListener('click', (event) => {
      if (event.target === this._modalElement) {
        this.close();
      }
    });
  }
}

