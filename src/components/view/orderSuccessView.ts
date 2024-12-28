export class OrderSuccessView {
  private template: HTMLTemplateElement;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;

    const template = document.getElementById('success') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Template with ID "success" not found');
    }
    this.template = template;
  }

  render(totalAmount: number) {
    // Клонируем
    const clone = this.template.content.cloneNode(true) as HTMLElement;

    // Вставляем сумму
    const totalAmountElement = clone.querySelector('.order-success__description');
    if (totalAmountElement) {
      totalAmountElement.textContent = `Списано ${totalAmount.toLocaleString()} синапсов`;
    }

    // Возвращаем готовый элемент
    return clone;
  }
}
