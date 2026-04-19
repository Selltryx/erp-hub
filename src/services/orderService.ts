import { pool } from "../config/database";
import { decreaseStock } from "./stockService";
import { findKitBySku } from "./kitService";
import { Order } from "../models/order";

export async function processOrder(order: Order) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "INSERT INTO orders (id, marketplace, total) VALUES ($1, $2, $3)",
      [order.id, order.marketplace, order.total]
    );

    for (const item of order.items) {
      await client.query(
        `INSERT INTO order_items (order_id, sku, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.sku, item.quantity, item.price]
      );

      const kit = await findKitBySku(item.sku);

      if (kit) {
        for (const kitItem of kit.items) {
          await decreaseStock(
            client,
            kitItem.sku,
            kitItem.quantity * item.quantity
          );
        }
      } else {
        await decreaseStock(client, item.sku, item.quantity);
      }
    }

    await client.query("COMMIT");

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}