import { ICatalog, Product } from "../../types";

/**
 * Класс Catalog управляет данными каталога товаров.
 * Отвечает за хранение, обновление и предоставление данных о товарах.
 */
export class Catalog implements ICatalog {
  // Массив объектов товаров
  private products: Product[] = [];

  /**
   * Конструктор инициализирует каталог c пустым массивом товаров. 
   */
  constructor() {
    this.products = [];
  }

  /**
   * Устанавливает список товаров в каталог.
   * @param products - массив объектов товаров.
   */
  setProducts(products: Product[]): void {
    this.products = products;
  }

  /**
   * Возвращает текущий список товаров из каталога.
   * @returns массив объектов товаров
   */
  getProducts(): Product[] {
    return this.products;
  }
}