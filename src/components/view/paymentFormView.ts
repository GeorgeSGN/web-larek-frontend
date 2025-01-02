import { IPaymentFormView } from '../../types';
import { EventEmitter } from '../base/events';

export class PaymentFormView implements IPaymentFormView {
  container: HTMLElement;
  paymentMethod: string | null;
  deliveryAddress: HTMLInputElement | null;
  private eventEmitter: EventEmitter;
  private nextButton: HTMLButtonElement | null;
  private paymentButtons: NodeListOf<HTMLButtonElement>;

  constructor(eventEmitter: EventEmitter) {
    this.container = document.createElement('div');
    this.eventEmitter = eventEmitter;

    const template = document.getElementById('order') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "order" not found');
    }

    const clone = template.content.cloneNode(true) as HTMLElement;
    this.container.appendChild(clone);

    this.deliveryAddress = this.container.querySelector('.form__input') as HTMLInputElement;
    // Инициализируем элементы
    this.nextButton = this.container.querySelector('.order__button') as HTMLButtonElement;
    this.paymentButtons = this.container.querySelectorAll('.button_alt');
    // Настраиваем события выбора способа оплаты
    this.setupPaymentMethodListeners();

    // Настраиваем событие для ввода адреса доставки
    this.deliveryAddress?.addEventListener('input', () => this.updateNextButtonState());
  }

  /**
   * Привязываем события «Онлайн» / «При получении», чтобы знать выбранный метод.
   */
  private setupPaymentMethodListeners(): void {
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.paymentButtons.forEach((btn) => btn.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        this.paymentMethod = button.getAttribute('name') || null;

        // Эмитируем событие выбора способа оплаты
        this.eventEmitter.emit('order:paymentMethodSelected', { method: this.paymentMethod });

        // Обновляем состояние кнопки "Далее"
        this.updateNextButtonState();
      });
    });
  }

  /**
   * Активируем/блокируем кнопку "Далее" в зависимости от выбранного метода и адреса.
   */
  updateNextButtonState(): void {
    if (!this.nextButton || !this.deliveryAddress) return;
  
    const errors = [];
    if (!this.paymentMethod) errors.push('Выберите способ оплаты.');
    if (!this.deliveryAddress.value.trim()) errors.push('Введите адрес доставки.');
  
    // Выводим ошибки
    const errorElement = this.container.querySelector('.form__errors') as HTMLElement;
    if (errorElement) {
      errorElement.textContent = errors.join(' ');
    }
  
    // Устанавливаем кастомную ошибку для поля
    if (this.deliveryAddress) {
      this.deliveryAddress.setCustomValidity(
        this.deliveryAddress.value.trim() ? '' : 'Введите адрес доставки.'
      );
    }
  
    const isValid = errors.length === 0;
    this.nextButton.disabled = !isValid;
  }
  

  getData(): { paymentMethod: string; deliveryAddress: string } {
    return {
      paymentMethod: this.paymentMethod || '',
      deliveryAddress: this.deliveryAddress?.value || '',
    };
  }

  bindEvents(onNext: () => void): void {
    const form = this.container.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.paymentMethod && this.deliveryAddress?.value.trim()) {
        onNext();
      }
    });
  }

  render(): HTMLElement {
    return this.container;
  }

  displayErrors(errors: string[]): void {
    const errorElement = this.container.querySelector('.form__errors') as HTMLElement;
    if (errorElement) {
      errorElement.textContent = errors.join(' ');
    }
  }  
}
