import express from 'express'
import {
  getCartById,
  getProducts,
  getProductsById,
  getProductsRealtime
} from '../dao/mongoDb/controllers/views.controller.js'

const router = express.Router()

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
router.get('/realtimeproducts', getProductsRealtime)

router.get('/chat', async function (req, res) {
  try {
    res.render('chat')
  } catch (err) {
    res.json({ error: err.message })
  }
})

export default router
