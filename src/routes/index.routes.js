import express from "express";
import ProductManager from "../store/ProductManager.js";
import carts from "./carts.routes.js";
import products from "./products.routes.js";

const router = express.Router();
const product = new ProductManager();

//RUTAS
router.use("/api/products", products);
router.use("/api/carts", carts);

router.get("/", async function (req, res) {
  const products = await product.getProducts();
  const data = { products }
  res.render("home", data);
})

router.get("/realtimeproducts", async function (req, res) {
  try {
    const products = await product.getProducts();
    const data = { products }
    res.render("realTimeProducts", data);
  } catch (err) {
    res.json({ error: err.message });
  }
})


export default router;
