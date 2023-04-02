import express from 'express'
import {
  getCartById,
  getProducts,
  getProductsById,
  getProductsRealtime,
  login,
  profile,
  register
} from '../dao/mongoDb/controllers/views.controller.js'

const router = express.Router()

router.get('/', async function (_req, res) {
  try {
    // res.render('home', {})
    res.redirect('/login')
  } catch (err) {
    res.json({ error: err.message })
  }
})

router.get('/session', async function (req, res) {
  if (req.session.counter) {
    req.session.counter++
    res.send(`se a visitado  ${req.session.counter} veces`)
  } else {
    req.session.counter = 1
    res.send(`Bienvenido`)
  }
})

router.get('/login', login)
router.get('/register', register)
router.get('/profile', profile)

router.get('/failregister', async (req, res) => {
  console.log('failed to strategy')
  res.send({
    error: 'failed to register'
  })
})

router.get('/faillogin', async (req, res) => {
  console.log('failed to strategy')
  console.log(req.user)
  res.send({
    error: 'failed to login'
  })
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
