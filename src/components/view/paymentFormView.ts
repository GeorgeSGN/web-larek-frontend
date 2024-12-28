import { IPaymentFormView } from '../../types';
import { EventEmitter } from '../base/events';

export class PaymentFormView implements IPaymentFormView {
  container: HTMLElement;
  paymentMethod: string | null;
  deliveryAddress: HTMLInputElement | null;
  private eventEmitter: EventEmitter;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    this.container = container;
    this.paymentMethod = null;
    this.deliveryAddress = null;
    this.eventEmitter = eventEmitter;
  }

  render(): void {
    const template = document.getElementById('order') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "order" not found');
    }

    const clone = template.content.cloneNode(true) as HTMLElement;
    this.container.innerHTML = '';
    this.container.appendChild(clone);

    // Находим поле адреса
    this.deliveryAddress = this.container.querySelector('.form__input') as HTMLInputElement;

    // Подключаем обработчики
    this.setupPaymentMethodListeners();

    this.deliveryAddress?.addEventListener('input', () => {
      this.updateNextButtonState(); // Обновляем состояние кнопки при вводе адреса
    });

    this.updateNextButtonState(); // Проверяем состояние кнопки при первом рендере
  }

   /**
   * Привязываем события «Онлайн» / «При получении», чтобы знать выбранный метод.
   */
  setupPaymentMethodListeners(): void {
    const buttons = this.container.querySelectorAll('.button_alt') as NodeListOf<HTMLButtonElement>;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        // Убираем класс button_alt-active со всех кнопок
        buttons.forEach((btn) => btn.classList.remove('button_alt-active'));

        // Добавляем класс button_alt-active на выбранную кнопку
        button.classList.add('button_alt-active');

        // Устанавливаем выбранный метод оплаты
        this.paymentMethod = button.getAttribute('name') || '';

        // Эмитируем событие с выбранным методом оплаты
        this.eventEmitter.emit('order:paymentMethodSelected', { method: this.paymentMethod });

        // Обновляем состояние кнопки
        this.updateNextButtonState();
      });
    });
  }

  /**
   * Активируем/блокируем кнопку "Далее" в зависимости от выбранного метода и адреса.
   */
  updateNextButtonState(): void {
    const nextButton = this.container.querySelector('.order__button') as HTMLButtonElement;

    if (!nextButton) return; // Если кнопка не найдена, выходим

    const isPaymentMethodSelected = !!this.paymentMethod;
    const isAddressEntered = !!this.deliveryAddress?.value.trim();

    // Активируем или блокируем кнопку
    nextButton.disabled = !(isPaymentMethodSelected && isAddressEntered);
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
      event.preventDefault(); // 
      if (this.paymentMethod && this.deliveryAddress?.value.trim()) {
        onNext(); //
      }
    });
  }
}
