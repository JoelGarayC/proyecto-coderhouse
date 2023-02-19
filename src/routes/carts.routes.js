import express from "express";
import {
  addCart,
  addProductToCart,
  getCartById,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", addCart);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", addProductToCart);

export default router;
