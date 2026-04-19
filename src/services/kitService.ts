import { pool } from "../config/database";
import { Kit } from "../models/kit";

export async function addKit(kit: Kit) {
  await pool.query("INSERT INTO kits (sku, name) VALUES ($1, $2)", [
    kit.sku,
    kit.name
  ]);

  for (const item of kit.items) {
    await pool.query(
      `INSERT INTO kit_items (kit_sku, product_sku, quantity)
       VALUES ($1, $2, $3)`,
      [kit.sku, item.sku, item.quantity]
    );
  }
}

export async function findKitBySku(sku: string) {
  const kitRes = await pool.query("SELECT * FROM kits WHERE sku = $1", [sku]);

  if (kitRes.rows.length === 0) return null;

  const itemsRes = await pool.query(
    "SELECT * FROM kit_items WHERE kit_sku = $1",
    [sku]
  );

  return {
    sku,
    name: kitRes.rows[0].name,
    items: itemsRes.rows.map(i => ({
      sku: i.product_sku,
      quantity: i.quantity
    }))
  };
}

export async function calculateKitStock(sku: string): Promise<number> {
  const items = await pool.query(
    "SELECT * FROM kit_items WHERE kit_sku = $1",
    [sku]
  );

  let min = Infinity;

  for (const item of items.rows) {
    const product = await pool.query(
      "SELECT stock_real FROM products WHERE sku = $1",
      [item.product_sku]
    );

    if (!product.rows[0]) return 0;

    const possible = Math.floor(
      product.rows[0].stock_real / item.quantity
    );

    if (possible < min) min = possible;
  }

  return min === Infinity ? 0 : min;
}

export async function getKits() {
  const kitsRes = await pool.query("SELECT * FROM kits");

  const result = [];

  for (const kit of kitsRes.rows) {
    const itemsRes = await pool.query(
      "SELECT * FROM kit_items WHERE kit_sku = $1",
      [kit.sku]
    );

    result.push({
      sku: kit.sku,
      name: kit.name,
      items: itemsRes.rows.map(i => ({
        sku: i.product_sku,
        quantity: i.quantity
      }))
    });
  }

  return result;
}