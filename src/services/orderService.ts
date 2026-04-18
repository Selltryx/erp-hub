import { decreaseStock } from "./stockService";
import { findKitBySku } from "./kitService";

type OrderItem = {
  sku: string;
  quantity: number;
};

type Order = {
  items: OrderItem[];
};

export function processOrder(order: Order) {
  if (!order.items || order.items.length === 0) {
    throw new Error("Pedido sem itens");
  }

  order.items.forEach((item) => {
    const kit = findKitBySku(item.sku);

        if (kit) {
      kit.items.forEach((kitItem) => {
        const totalQuantity = kitItem.quantity * item.quantity;

        decreaseStock(kitItem.sku, totalQuantity);
      });

    } else {      
      decreaseStock(item.sku, item.quantity);
    }
  });
}