import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ERP HUB rodando 🚀");
});

app.post("/webhook/order", (req, res) => {
  console.log("Pedido recebido:", req.body);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});