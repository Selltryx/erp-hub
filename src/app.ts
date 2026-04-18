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
  res.send("ERP HUB rodando 🚀");
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

app.post("/kit", (req, res) => {
  addKit(req.body);
  res.json({ message: "Kit cadastrado" });
});

app.get("/kits", (req, res) => {
  const kits = getKits().map(kit => ({
    ...kit,
    stockReal: calculateKitStock(kit)
  }));

  res.json(kits);
});

app.post("/webhook/order", (req, res) => {
  console.log("Pedido recebido:", req.body);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});