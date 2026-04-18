import { Order } from "../models/order";
import { updateStock, getProducts } from "./stockService";
import { getKits } from "./kitService";

let orders: Order[] = [];

export function processOrder(order: Order) {
  orders.push(order);

  const kits = getKits();

  order.items.forEach(item => {    
    const kit = kits.find(k => k.sku === item.sku);

    if (kit) {
      kit.items.forEach(kitItem => {
        updateStock(kitItem.sku, kitItem.quantity * item.quantity);
      });
    } else {      
      updateStock(item.sku, item.quantity);
    }
  });
}

export function getOrders() {
  return orders;
}