import mongoose from 'mongoose'
import {
  validateIdCart,
  validateIdProduct
} from '../../../utils/validations.js'
import { Cart } from '../models/Cart.js'
import { Product } from '../models/Product.js'
const { ObjectId } = mongoose.Types

class CartManager {
  async getCarts() {
    try {
      const data = await Cart.find()
      if (!data) return []
      return data
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async getCartById(id) {
    try {
      await validateIdCart(id)

      const cartById = await Cart.findById(id).populate('products._id')
      return cartById
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async addCart() {
    try {
      const newCart = new Cart({
        products: []
      })
      await newCart.save()
      return `Carrito agregado con éxito: []`
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async addProduct(idCart, idProduct) {
    try {
      const { cartById } = await validateIdCart(idCart)
      await validateIdProduct(idProduct)

      // Verificar si el producto ya existe en el carrito, si existe aumente el quantity
      const existProdinCart = await Cart.findOne({
        _id: idCart,
        'products._id': idProduct
      })

      if (existProdinCart) {
        // Si el producto ya existe en el carrito, se actualiza la cantidad
        await Cart.findOneAndUpdate(
          {
            _id: idCart,
            'products._id': idProduct
          },
          {
            $inc: { 'products.$.quantity': 1 }
          }
        )
        return (
          'Producto agregado a carrito con éxito al carrito con ID: ' +
          idCart +
          ', aumentó la cantidad del producto: ' +
          idProduct
        )
      }
      // Si el producto no existe en el carrito, se agrega con una cantidad de 1
      cartById.products.push({
        _id: idProduct,
        quantity: 1
      })
      await cartById.save()
      return (
        'Producto agregado a carrito con éxito al carrito con ID: ' + idCart
      )
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async updateProduct(idCart, idProduct, quantity) {
    try {
      if (!quantity)
        throw new Error(
          `Escribe la cantidad de ejemplares del producto en el "body", FORMATO: { 'quantity': valor }`
        )
      await validateIdCart(idCart)
      await validateIdProduct(idProduct)

      const existProdinCart = await Cart.findOne({
        _id: idCart,
        'products._id': idProduct
      })
      if (!existProdinCart)
        throw new Error(
          `El Producto con ID: ${idProduct} no se encontró en el carrito`
        )

      // Si el producto ya existe en el carrito, se actualiza la cantidad
      await Cart.findOneAndUpdate(
        {
          _id: idCart,
          'products._id': idProduct
        },
        {
          $set: { 'products.$.quantity': quantity }
        }
      )
      return `Producto con ID: ${idProduct} actualizado con éxito en el carrito`
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async updateProducts(idCart, products) {
    try {
      await validateIdCart(idCart)

      const array = Object.values(products)

      if (array.length === 0) throw new Error(`El body no puede estar vacío`)

      // validacion del arreglo de productos, de acueerdo al formato
      const isValid = array.every(
        (obj) =>
          obj.hasOwnProperty('_id') &&
          ObjectId.isValid(obj['_id']) &&
          obj.hasOwnProperty('quantity') &&
          Number.isInteger(obj['quantity']) &&
          obj['quantity'] >= 1
      )
      if (!isValid)
        throw new Error(
          `Escribe un formato (arreglo de productos) válido; ejemplo: [{'_id':'idValidodelProducto','quantity': 2},{'_id': 'idDelProd','quantity': 1}]`
        )

      // validacion de que todos los productos existen en la bd
      const productIds = await array.map((obj) => obj['_id'])
      const areProductsValid = await Product.find({
        _id: { $in: productIds }
      })
      const isValidProducts = areProductsValid.length === array.length
      if (!isValidProducts)
        throw new Error(
          `Uno o más IDs de los productos no existen en la base de datos`
        )

      await Cart.updateOne({ _id: idCart }, { $set: { products: array } })
      return `Todos los productos actualizados correctamente`
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async deleteProduct(idCart, idProduct) {
    try {
      await validateIdCart(idCart)
      await validateIdProduct(idProduct)

      const existProdinCart = await Cart.findOne({
        _id: idCart,
        'products._id': idProduct
      })
      if (!existProdinCart)
        throw new Error(
          `El Producto con ID: ${idProduct} no se encontró en el carrito`
        )

      // Eliminando el producto con id del carrito
      await Cart.updateOne(
        { _id: idCart },
        { $pull: { products: { _id: idProduct } } }
      )
      return `Producto con ID: ${idProduct} eliminado correctamente`
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async deleteProducts(idCart) {
    try {
      await validateIdCart(idCart)

      const cart = await Cart.findOne({ _id: idCart }).populate('products._id')
      const productsInCart = cart.products
      if (productsInCart.length === 0)
        throw new Error('No existe productos en el carrito para eliminar')

      await Cart.updateOne({ _id: idCart }, { $set: { products: [] } })
      return `Todos los productos  eliminados correctamente`
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

export default CartManager
