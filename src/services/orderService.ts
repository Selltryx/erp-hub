import { Order } from "../models/order";
import { updateStock, getProducts } from "./stockService";
import { getKits } from "./kitService";
import { findKitBySku } from "./kitService";

let orders: Order[] = [];

export function processOrder(order: Order) {
  orders.push(order);

  order.items.forEach(item => {

    const kit = findKitBySku(item.sku);

    if (kit) {      
      kit.items.forEach(kitItem => {
        const totalQty = kitItem.quantity * item.quantity;
        updateStock(kitItem.sku, totalQty);
      });
    } else {    
      updateStock(item.sku, item.quantity);
    }

  });
}