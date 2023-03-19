import express from 'express'
import ProductManager from '../dao/fileSystem/managers/ProductManager.js'
import {
  getCartById,
  getProducts,
  getProductsById
} from '../dao/mongoDb/controllers/views.controller.js'

const router = express.Router()

const product = new ProductManager()

router.get('/', async function (_req, res) {
  try {
    res.render('home', {})
  } catch (err) {
    res.json({ error: err.message })
  }
})

router.get('/products', getProducts)
router.get('/products/:pid', getProductsById)
router.get('/carts/:cid', getCartById)

router.get('/realtimeproducts', async function (_req, res) {
  try {
    const products = await product.getProducts()
    const data = { products }
    res.render('realTimeProducts', data)
  } catch (err) {
    res.json({ error: err.message })
  }
})

router.get('/chat', async function (req, res) {
  try {
    res.render('chat')
  } catch (err) {
    res.json({ error: err.message })
  }
})

export default router
