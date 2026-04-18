import { pool } from "./database";

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      sku TEXT PRIMARY KEY,
      name TEXT,
      stock_real INT,
      stock_virtual INT,
      cost NUMERIC
    );
  `);

  console.log("Banco inicializado");
}