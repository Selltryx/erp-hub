import express from "express";
import { processOrder } from "./services/orderService";
import { addProduct, getProducts } from "./services/stockService";

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

app.post("/product", (req, res) => {
  addProduct(req.body);
  res.json({ message: "Produto cadastrado" });
});

app.get("/product", (req, res) => {
  res.json(getProducts());
});

app.post("/order", (req, res) => {
  processOrder(req.body);
  res.json({ message: "Pedido processado" });
});

app.post("/webhook/order", (req, res) => {
  console.log("Pedido recebido:", req.body);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});