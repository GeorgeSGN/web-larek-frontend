import { EventEmitter } from '../base/events';

export class PaymentFormView {
  container: HTMLElement;
  paymentMethod: string | null;
  deliveryAddress: HTMLInputElement | null;
  private eventEmitter: EventEmitter;
  private nextButton: HTMLButtonElement | null;
  private paymentButtons: NodeListOf<HTMLButtonElement>;

  // Один колбэк для submit
  private onSubmitCallback: (() => void) | null = null;

  constructor(eventEmitter: EventEmitter) {
    this.container = document.createElement('div');
    this.eventEmitter = eventEmitter;

    const template = document.getElementById('order') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "order" not found');
    }

    const clone = template.content.cloneNode(true) as HTMLElement;
    this.container.appendChild(clone);

    this.paymentMethod = null;
    this.deliveryAddress = this.container.querySelector('.form__input') as HTMLInputElement;
    // Инициализируем элементы
    this.nextButton = this.container.querySelector('.order__button') as HTMLButtonElement;
    this.paymentButtons = this.container.querySelectorAll('.button_alt');
    // Настраиваем события выбора способа оплаты
    this.setupPaymentMethodListeners();

    // Настраиваем событие для ввода адреса доставки
    this.deliveryAddress?.addEventListener('input', () => this.updateNextButtonState());

    // Вешаем submit на <form> (один раз)
    const form = this.container.querySelector('form');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        // Если есть колбэк и форма валидна — вызываем
        if (this.paymentMethod && this.deliveryAddress?.value.trim() && this.onSubmitCallback) {
          this.onSubmitCallback();
        }
      });
    }

    // Изначально проверим состояние
    this.updateNextButtonState();
  }

  /**
   * Указываем, что делать при нажатии "Далее" (submit формы).
   */
  public setOnSubmit(onNext: () => void): void {
    this.onSubmitCallback = onNext;
  }

  public show(): void {
    this.updateNextButtonState();
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
  private updateNextButtonState(): void {
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
  

  public getData(): { paymentMethod: string; deliveryAddress: string } {
    return {
      paymentMethod: this.paymentMethod || '',
      deliveryAddress: this.deliveryAddress?.value || '',
    };
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
