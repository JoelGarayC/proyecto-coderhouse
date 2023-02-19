import express from "express";
import {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../controllers/product.controller.js";
import { uploader } from "../middlewares/uploaderImages.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(uploader.array("thumbnails"), addProduct);

router
  .route("/:pid")
  .get(getProductById)
  .put(uploader.array("thumbnails"), updateProductById)
  .delete(deleteProductById);

export default router;
