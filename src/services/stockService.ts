import { pool } from "../config/database";
import { Product } from "../models/product";

export async function addProduct(product: Product) {
  await pool.query(
    `INSERT INTO products (sku, name, stock_real, stock_virtual, vitrine_limit, cost)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (sku) DO NOTHING`,
    [
      product.sku,
      product.name,
      product.stockReal,
      product.stockVirtual,
      product.vitrineLimit,
      product.cost
    ]
  );
}

export async function getProducts(): Promise<Product[]> {
  const result = await pool.query("SELECT * FROM products");

  return result.rows.map(row => ({
    sku: row.sku,
    name: row.name,
    stockReal: row.stock_real,
    stockVirtual: row.stock_virtual,
    vitrineLimit: row.vitrine_limit,
    cost: Number(row.cost)
  }));
}

export async function decreaseStock(client: any, sku: string, quantity: number) {
  const result = await client.query(
    "SELECT * FROM products WHERE sku = $1 FOR UPDATE",
    [sku]
  );

  const product = result.rows[0];

  if (!product) throw new Error(`Produto não encontrado: ${sku}`);

  if (product.stock_real < quantity) {
    throw new Error(`Estoque insuficiente: ${sku}`);
  }

  const newStock = product.stock_real - quantity;

  const newVirtual =
    newStock <= 0 ? 0 : product.vitrine_limit;

  await client.query(
    `UPDATE products
     SET stock_real = $1, stock_virtual = $2
     WHERE sku = $3`,
    [newStock, newVirtual, sku]
  );
}