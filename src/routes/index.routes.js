import express from 'express'
import carts from './carts.routes.js'
import products from './products.routes.js'
import sessions from './sessions.routes.js'

const router = express.Router()

//RUTAS
router.use('/sessions', sessions)
router.use('/products', products)
router.use('/carts', carts)

export default router
