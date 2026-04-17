import { Kit } from "../models/kit";
import { getProducts } from "./stockService";

let kits: Kit[] = [];

export function addKit(kit: Kit) {
  kits.push(kit);
}

export function getKits() {
  return kits;
}

export function calculateKitStock(kit: Kit): number {
  const products = getProducts();

  let possibleStock = Infinity;

  for (const item of kit.items) {
    const product = products.find(p => p.sku === item.sku);
    if (!product) return 0;

    const possible = Math.floor(product.stockReal / item.quantity);

    if (possible < possibleStock) {
      possibleStock = possible;
    }
  }

  return possibleStock === Infinity ? 0 : possibleStock;
}