import axios from 'axios'
import { app } from '../../../config.js'

export async function getProducts(req, res) {
  const { limit = 10, page = 1, sort = '', query = '' } = req.query
  try {
    const baseUrl = `${req.protocol}://${req.hostname}:${req.socket.localPort}`
    const prods = await axios.get(
      `${baseUrl}${app.pathApi}/products?limit=${limit}&page=${page}&sort=${sort}&query=${query}`
    )

    const products = prods?.data?.payload
    const prevPage = prods?.data?.prevPage
    const nextPage = prods?.data?.nextPage

    res.render('products', { products, prevPage, nextPage, limit, sort, query })
  } catch (err) {
    res.json({ error: err.message })
  }
}

export async function getProductsById(req, res) {
  try {
    const baseUrl = `${req.protocol}://${req.hostname}:${req.socket.localPort}`
    const productDetails = await axios.get(
      `${baseUrl}${app.pathApi}/products/${req.params.pid}`
    )

    const data = productDetails?.data?.product
    res.render('productsDetails', { data })
  } catch (error) {
    res.json({ error: err.message })
  }
}

export async function getCartById(req, res) {
  try {
    const baseUrl = `${req.protocol}://${req.hostname}:${req.socket.localPort}`
    const cartDetails = await axios.get(
      `${baseUrl}${app.pathApi}/carts/${req.params.cid}`
    )
    const data = cartDetails?.data?.cart?.products
    res.render('cartDetails', { data })
  } catch (error) {
    res.json({ error: err.message })
  }
}
