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
  getCartById,
  getCarts
} from '../dao/mongoDb/controllers/cart.controller.js'

const router = express.Router()

router
  .route('/')
  .get(getCarts)
  .post(withMongoDb ? addCart : addCartFs)

router.get('/:cid', withMongoDb ? getCartById : getCartByIdFs)

router
  .route('/:cid/product/:pid')
  .post(withMongoDb ? addProductToCart : addProductToCartFs)
  .delete(deleteProductToCart)

export default router
