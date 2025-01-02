export class OrderSuccessView {
  private element: HTMLElement;
  private closeButton: HTMLButtonElement | null = null;
  private onCloseCallback: (() => void) | null = null;

  constructor() {
    // Ищем шаблон #success
    const template = document.getElementById('success') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "success" not found');
    }

    // Сразу клонируем (чтобы кнопка была одна и слушатели не плодились)
    const clone = template.content.cloneNode(true) as HTMLElement;

    // Корневой элемент "order-success"
    const rootElement = clone.querySelector('.order-success') as HTMLElement;
    if (!rootElement) {
      throw new Error('.order-success not found in #success template');
    }
    this.element = rootElement;

    // Ищем кнопку «Закрыть», вешаем 1 раз
    this.closeButton = this.element.querySelector('.order-success__close') as HTMLButtonElement;
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        if (this.onCloseCallback) {
          this.onCloseCallback();
        }
      });
    }
  }

   /**
   * Указываем, что делать при нажатии «Закрыть».
   */
   public setOnClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }

  /**
   * Устанавливаем сумму, обновляя текст .order-success__description.
   */
  public setTotalAmount(totalAmount: number): void {
    const totalAmountElement = this.element.querySelector('.order-success__description');
    if (totalAmountElement) {
      totalAmountElement.textContent = `Списано ${totalAmount.toLocaleString()} синапсов`;
    }
  }

  /**
   * Возвращаем готовый <div class="order-success">, который можно вставлять куда нужно
   */
  public render(): HTMLElement {
    return this.element;
  }
}