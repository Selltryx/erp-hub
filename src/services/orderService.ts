import { Order } from "../models/order";
import { updateStock } from "./stockService";

let orders: Order[] = [];

export function processOrder(order: Order) {
  orders.push(order);

  order.items.forEach(item => {
    updateStock(item.sku, item.quantity);
  });
}

export function getOrders() {
  return orders;
}