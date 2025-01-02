/**
 * Класс ContactFormView управляет отображением второго шага оформления заказа,
 * включая ввод email и номера телефона, используя HTML-шаблон.
 */
export class ContactFormView {
  private container: HTMLElement;
  private formElement: HTMLFormElement | null = null;
  private emailInput: HTMLInputElement | null = null;
  private phoneInput: HTMLInputElement | null = null;
  private formErrorsElement: HTMLElement | null = null;

  private onInputCallback: ((email: string, phone: string) => void) | null = null;
  private onSubmitCallback: (() => void) | null = null;

  constructor() {
    this.container = document.createElement('div');

    const template = document.getElementById('contacts') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "contacts" not found');
    }

    const clone = template.content.cloneNode(true) as HTMLElement;
    const form = clone.querySelector('form');
    if (!form || !(form instanceof HTMLFormElement)) {
      throw new Error('No <form> found in #contacts template');
    }
    this.formElement = form;

    // Инициализируем поля
    this.emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
    this.formErrorsElement = form.querySelector('.form__errors') as HTMLElement;

    // Навешиваем обработчики ввода
    this.emailInput?.addEventListener('input', () => {
      if (this.onInputCallback) {
        this.onInputCallback(this.emailInput?.value || '', this.phoneInput?.value || '');
      }
    });

    this.phoneInput?.addEventListener('input', () => {
      if (this.onInputCallback) {
        this.onInputCallback(this.emailInput?.value || '', this.phoneInput?.value || '');
      }
    });

    // Навешиваем обработчик submit
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.onSubmitCallback) {
        this.onSubmitCallback();
      }
    });
  }

  /**
   * Привязывает коллбек для событий ввода.
   */
  public setOnInput(callback: (email: string, phone: string) => void): void {
    this.onInputCallback = callback;
  }

  /**
   * Привязывает коллбек для события отправки формы.
   */
  public setOnSubmit(callback: () => void): void {
    this.onSubmitCallback = callback;
  }

  /**
   * Вызывается извне, чтобы отобразить форму (вставить её в контейнер).
   */
  public show(): void {
    this.container.innerHTML = '';
    if (this.formElement) {
      this.container.appendChild(this.formElement);
    }
  }

  /**
   * Обновляет состояние кнопки "Оплатить" в зависимости от валидности полей.
   */
  public updateSubmitButtonState(isValid: boolean): void {
    const submitButton = this.container.querySelector('.button') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = !isValid;
    }
  }

  /**
   * Подсвечивает невалидные поля на основе ошибок.
   */
  public highlightInvalidFields(errors: string[]): void {
    if (this.emailInput) {
      const emailError = errors.find((error) => error.includes('email'));
      this.emailInput.setCustomValidity(emailError || '');
    }

    if (this.phoneInput) {
      const phoneError = errors.find((error) => error.includes('телефон'));
      this.phoneInput.setCustomValidity(phoneError || '');
    }
  }

  /**
   * Отображает ошибки в поле ошибок.
   */
  public displayErrors(errors: string[]): void {
    if (this.formErrorsElement) {
      this.formErrorsElement.textContent = errors.join(' ');
    }
  }

  /**
   * Получает DOM-элемент формы для вставки в модальное окно.
   */
  public render(): HTMLElement {
    return this.container;
  }
}
