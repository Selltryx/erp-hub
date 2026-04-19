import { pool } from "./database";

export async function initDb() {
  await pool.query(`/* COLE AQUI O SQL QUE TE PASSEI */`);
  console.log("Banco inicializado");
}