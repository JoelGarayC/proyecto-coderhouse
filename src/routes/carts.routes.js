import express from 'express'
import { withMongoDb } from '../config.js'
import {
  addCart as addCartFs,
  addProductToCart as addProductToCartFs,
  getCartById as getCartByIdFs
} from '../dao/fileSystem/controllers/cart.controller.js'
import {
  addCart,
  addProductToCart,
  deleteProductToCart,
  deleteProductsToCart,
  getCartById,
  getCarts,
  updateProductToCart,
  updateProductsToCart
} from '../dao/mongoDb/controllers/cart.controller.js'

const router = express.Router()

router
  .route('/')
  .get(getCarts)
  .post(withMongoDb ? addCart : addCartFs)

router
  .route('/:cid')
  .get(withMongoDb ? getCartById : getCartByIdFs)
  .put(updateProductsToCart)
  .delete(deleteProductsToCart)
//put

router
  .route('/:cid/products/:pid')
  .post(withMongoDb ? addProductToCart : addProductToCartFs)
  .put(updateProductToCart)
  .delete(deleteProductToCart)

export default router
