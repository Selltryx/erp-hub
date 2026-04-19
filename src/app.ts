import express from "express";
import { processOrder } from "./services/orderService";
import { addProduct, getProducts } from "./services/stockService";
import { addKit, getKits, calculateKitStock } from "./services/kitService";
import { initDb } from "./config/initDb";
import { pool } from "./config/database";

initDb();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ERP HUB v2 🚀");
});

app.get("/test", (req, res) => {
  res.json({
    status: "ok",
    message: "ERP HUB funcionando 🚀",
    time: new Date().toISOString()
  });
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "Banco conectado",
      time: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro na conexão com banco"
    });
  }
});

app.post("/product", async (req, res) => {
  await addProduct(req.body);
  res.json({ message: "Produto salvo no banco" });
});

app.get("/products", async (req, res) => {
  const products = await getProducts();
  res.json(products);
});

app.post("/order", (req, res) => {
  processOrder(req.body);
  res.json({ message: "Pedido processado" });
});

app.get("/order", (req, res) => {
  res.status(200).json({
    message: "Use POST /order para criar pedidos"
  });
});

app.post("/kit", async (req, res) => {
  await addKit(req.body);
  res.json({ message: "Kit cadastrado" });
});

app.get("/kits", async (req, res) => {
  const kits = await getKits();

  const result = [];

  for (const kit of kits) {
    const stock = await calculateKitStock(kit.sku);

    result.push({
      ...kit,
      stockReal: stock
    });
  }

  res.json(result);
});

app.post("/webhook/order", (req, res) => {
  console.log("Pedido recebido:", req.body);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});