import express from "express";
import { withMongoDb } from "../config.js";
import {
  addProduct as addProductFs,
  deleteProductById as deleteProductByIdFs,
  getProductById as getProductByIdFs,
  getProducts as getProductsFs,
  updateProductById as updateProductByIdFs,
} from "../dao/fileSystem/controllers/product.controller.js";
import {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../dao/mongoDb/controllers/product.controller.js";
import { uploader } from "../middlewares/uploaderImages.js";

const router = express.Router();

router
  .route("/")
  .get(withMongoDb ? getProducts : getProductsFs)
  .post(uploader.array("thumbnails"), withMongoDb ? addProduct : addProductFs);

router
  .route("/:pid")
  .get(withMongoDb ? getProductById : getProductByIdFs)
  .put(
    uploader.array("thumbnails"),
    withMongoDb ? updateProductById : updateProductByIdFs
  )
  .delete(withMongoDb ? deleteProductById : deleteProductByIdFs);

export default router;
