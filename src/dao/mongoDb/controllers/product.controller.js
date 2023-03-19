import { app } from '../../../config.js'
import ProductManager from '../managers/ProductManager.js'

const product = new ProductManager()

export async function getProducts(req, res) {
  const { limit, page, sort, query } = req.query
  try {
    const resp = await product.getProducts({ limit, page, sort, query })

    const baseUrl = `${req.protocol}://${req.hostname}:${req.socket.localPort}`
    const links = {}
    if (resp.prevPage !== null) {
      links.prev = `${baseUrl}${app.pathApi}/products?page=${
        resp.page - 1
      }&limit=${resp.limit}&sort=${sort ? sort : ''}`
    }
    if (resp.nextPage !== null) {
      links.next = `${baseUrl}${app.pathApi}/products?page=${
        resp.page + 1
      }&limit=${resp.limit}&sort=${sort ? sort : ''}`
    }

    const products = {
      status: 'success',
      payload: resp.docs,
      totalPages: Math.ceil(resp.totalDocs / resp.limit),
      prevPage: resp.prevPage,
      nextPage: resp.nextPage,
      page: resp.page,
      hasPrevPage: resp.hasPrevPage,
      hasNextPage: resp.hasNextPage,
      prevLink: resp.hasPrevPage === false ? null : links.prev,
      nextLink: resp.hasNextPage === false ? null : links.next
    }

    res.json(products)
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}

export async function getProductById(req, res) {
  const { pid } = req.params
  try {
    const response = await product.getProductById(pid)
    res.json({
      ok: true,
      product: response
    })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}

export async function addProduct(req, res) {
  const { title, description, code, stock, price, category, thumbnails } =
    req.body
  try {
    const newProduct = {
      title,
      description,
      code,
      stock,
      price,
      thumbnails,
      category
    }

    const response = await product.addProduct(newProduct)
    res.json({
      ok: true,
      message: response
    })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}

export async function updateProductById(req, res) {
  const { title, description, code, stock, price, category } = req.body
  const { pid } = req.params
  try {
    let imagenes = []

    const updateProduct = {
      title,
      description,
      code,
      stock,
      price,
      thumbnails: imagenes,
      category
    }

    const response = await product.updateProduct(pid, updateProduct)
    res.json({
      ok: true,
      message: response
    })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}

export async function deleteProductById(req, res) {
  const { pid } = req.params
  try {
    const response = await product.deleteProduct(pid)
    res.json({
      ok: true,
      message: response
    })
  } catch (err) {
    res.json({ status: 'error', message: err.message })
  }
}
