import CartManager from '../managers/CartManager.js'

const cart = new CartManager()

export async function getCarts(req, res) {
  try {
    const response = await cart.getCarts()
    res.json({
      status: 'success',
      carts: response
    })
  } catch (err) {
    res.json({ error: err.message })
  }
}

export async function getCartById(req, res) {
  const { cid } = req.params
  try {
    const response = await cart.getCartById(cid)
    res.json({
      status: 'success',
      cart: response
    })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}

export async function addCart(req, res) {
  try {
    const { message } = await cart.addCart()
    res.json({
      status: 'success',
      message
    })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}

export async function addProductToCart(req, res) {
  const { cid, pid } = req.params
  try {
    const response = await cart.addProduct(cid, pid)
    res.json({
      status: 'success',
      message: response
    })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}

export async function updateProductToCart(req, res) {
  const { cid, pid } = req.params
  const { quantity } = req.body
  try {
    const response = await cart.updateProduct(cid, pid, quantity)
    res.json({
      status: 'success',
      message: response
    })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}

export async function updateProductsToCart(req, res) {
  const { cid } = req.params
  try {
    const response = await cart.updateProducts(cid, req.body)
    res.json({
      status: 'success',
      message: response
    })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}

export async function deleteProductToCart(req, res) {
  const { cid, pid } = req.params
  try {
    const response = await cart.deleteProduct(cid, pid)
    res.json({
      status: 'success',
      message: response
    })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}

export async function deleteProductsToCart(req, res) {
  const { cid } = req.params
  try {
    const response = await cart.deleteProducts(cid)
    res.json({
      status: 'success',
      message: response
    })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}
