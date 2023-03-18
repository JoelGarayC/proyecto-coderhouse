import fs from 'fs'
import mongoose from 'mongoose'
import { Cart } from '../dao/mongoDb/models/Cart.js'
import { Product } from '../dao/mongoDb/models/Product.js'
const { ObjectId } = mongoose.Types

export function validateFields(product) {
  const requiredFields = [
    'title',
    'description',
    'price',
    'code',
    'stock',
    'category',
    'status'
  ]

  for (const field of requiredFields) {
    if (!product[field]) throw new Error(`El campo "${field}" es requerido`)
  }
}

export function validateType(product) {
  const validateFieldsNumber = ['price', 'stock']
  const validateFieldsString = ['title', 'description', 'code', 'category']

  for (const field of validateFieldsNumber) {
    if (typeof product[field] !== 'number')
      throw new Error(`El campo "${field}" deber ser de tipo numérico`)
  }

  for (const field of validateFieldsString) {
    if (typeof product[field] !== 'string')
      throw new Error(`El campo "${field}" deber ser de tipo string`)
  }
}

export function validateOther(product) {
  if (product.price < 0)
    throw new Error(`El campo "price" no puede ser un numero negativo`)

  if (product.stock < 0 || product.stock % 1 !== 0)
    throw new Error(
      `El campo "stock" deber ser un número entero o no puede ser un numero negativo`
    )
}

export function validateExistCode(product, products) {
  if (!products) {
    throw new Error('No se ha encontrado ningún producto')
  }
  const codeExists = products.some((prod) => prod.code === product.code)
  if (codeExists)
    throw new Error(
      `El código "${product.code}" ya existe en la lista, escribe otro!`
    )
}

export function validateFileJson(pathFile) {
  if (!fs.existsSync(pathFile))
    throw new Error(
      `El archivo de products.json no existe en la ruta "${pathFile}"`
    )
}

export async function validateIdCart(idCart) {
  if (!ObjectId.isValid(idCart))
    throw new Error(`El ID ${idCart} del carrito no es válido`)

  const cartById = await Cart.findById(idCart)
  if (!cartById) throw new Error(`Carrito con ID: ${idCart} no encontrado`)
  return { cartById }
}

export async function validateIdProduct(idProduct) {
  if (!ObjectId.isValid(idProduct))
    throw new Error(`El ID ${idProduct} del producto no es válido`)

  const productById = await Product.findById(idProduct)
  if (!productById)
    throw new Error(`Producto con ID: ${idProduct} no encontrado`)
  return { productById }
}
