import express from "express";
import ProductManager from "../dao/fileSystem/managers/ProductManager.js";

const router = express.Router();

const product = new ProductManager();

router.get("/", async function (req, res) {
  try {
    const products = await product.getProducts();
    const data = { products };
    res.render("home", data);
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get("/realtimeproducts", async function (_req, res) {
  try {
    const products = await product.getProducts();
    const data = { products };
    res.render("realTimeProducts", data);
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get("/chat", async function (req, res) {
  try {
    res.render("chat");
  } catch (err) {
    res.json({ error: err.message });
  }
});

export default router;
