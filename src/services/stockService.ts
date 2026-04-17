import { Product } from "../models/product";

let products: Product[] = [];

export function addProduct(product: Product) {
  products.push(product);
}

export function getProducts() {
  return products;
}

export function updateStock(sku: string, quantity: number) {
  const product = products.find(p => p.sku === sku);
  if (!product) return;

  product.stockReal -= quantity;

  if (product.stockReal <= 0) {
    product.stockVirtual = 0;
  }
}