import { IContactFormView } from '../../types';

/**
 * Класс ContactFormView управляет отображением второго шага оформления заказа,
 * включая ввод email и номера телефона, используя HTML-шаблон.
 */
export class ContactFormView implements IContactFormView {
  container: HTMLElement;
  email: HTMLInputElement | null;
  phone: HTMLInputElement | null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.email = null;
    this.phone = null;
  }

  /**
   * Отображает форму ввода email и номера телефона,
   * используя HTML-шаблон.
   */
  render(): void {
    const template = document.getElementById('contacts') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "contacts" not found');
    }

    // Клонируем содержимое шаблона
    const clone = template.content.cloneNode(true) as HTMLElement;

    // Очищаем контейнер и добавляем содержимое шаблона
    this.container.innerHTML = '';
    this.container.appendChild(clone);

    // Находим элементы формы
    this.email = this.container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phone = this.container.querySelector('input[name="phone"]') as HTMLInputElement;

    // Устанавливаем начальное состояние кнопки
    this.updateSubmitButtonState();
  }

  /**
   * Возвращает данные формы: email и номер телефона.
   * @returns объект с полями email и phone.
   */
  getData(): { email: string; phone: string } {
    const email = this.email?.value || '';
    const phone = this.phone?.value || '';
    return { email, phone };
  }

  /**
   * Обновляет состояние кнопки "Оплатить" в зависимости от валидности полей.
   */
  updateSubmitButtonState(): void {
    const submitButton = this.container.querySelector('.button') as HTMLButtonElement;

    if (!submitButton) return; // Если кнопка не найдена, выходим

    const isEmailValid = this.email?.value.trim() && /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email.value);
    const isPhoneValid = this.phone?.value.trim() && /^\+?[0-9\s-]{7,15}$/.test(this.phone.value);

    submitButton.disabled = !(isEmailValid && isPhoneValid); // Блокируем кнопку, если данные некорректны
  }

  /**
   * Привязывает события для завершения оформления заказа.
   * @param onSubmit - функция, вызываемая при нажатии на кнопку "Оплатить".
   */
  bindEvents(onSubmit: () => void): void {
    const submitButton = this.container.querySelector('.button') as HTMLButtonElement;

    // Обновляем состояние кнопки при каждом вводе данных
    this.email?.addEventListener('input', () => this.updateSubmitButtonState());
    this.phone?.addEventListener('input', () => this.updateSubmitButtonState());

    // Обработчик для кнопки "Оплатить"
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        if (!submitButton.disabled) {
          onSubmit();
        }
      });
    }
  }
}
