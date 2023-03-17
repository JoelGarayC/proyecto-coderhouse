import mongoose from 'mongoose'
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
      return err.message
    }
  }

  async getCartById(id) {
    try {
      if (!ObjectId.isValid(id)) throw new Error(`El ID ${id} no es válido`)

      const cartById = await Cart.findById(id)
      if (!cartById) throw new Error(`Carrito con ID: ${id} no encontrado`)
      return cartById
    } catch (err) {
      return err.message
    }
  }

  async addCart() {
    try {
      const newCart = new Cart({
        products: []
      })
      await newCart.save()
      return `Carrito agregado con éxito`
    } catch (err) {
      return err.message
    }
  }

  async addProduct(idCart, idProduct) {
    try {
      if (!ObjectId.isValid(idCart))
        throw new Error(`El ID ${idCart} del carrito no es válido`)

      if (!ObjectId.isValid(idProduct))
        throw new Error(`El ID ${idProduct} del producto no es válido`)

      const cartById = await Cart.findById(idCart)
      if (!cartById) throw new Error(`Carrito con ID: ${idCart} no encontrado`)

      const productById = await Product.findById(idProduct)
      if (!productById)
        throw new Error(`Producto con ID: ${idProduct} no encontrado`)

      // Verificar si el producto ya existe en el carrito, si existe aumente el quantity
      const existProdinCart = await Cart.findOne({
        'products._id': productById
      })

      if (existProdinCart) {
        // Si el producto ya existe en el carrito, se actualiza la cantidad
        await Cart.findOneAndUpdate(
          {
            _id: cartById._id,
            'products._id': productById._id
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
      } else {
        // Si el producto no existe en el carrito, se agrega con una cantidad de 1
        cartById.products.push({ _id: productById._id, quantity: 1 })
        await cartById.save()
        return (
          'Producto agregado a carrito con éxito al carrito con ID: ' + idCart
        )
      }
    } catch (err) {
      return err.message
    }
  }

  async deleteProduct(idCart, idProduct) {
    try {
      if (!ObjectId.isValid(idCart))
        throw new Error(`El ID ${idCart} del carrito no es válido`)

      if (!ObjectId.isValid(idProduct))
        throw new Error(`El ID ${idProduct} del producto no es válido`)

      const cartById = await Cart.findById(idCart)
      if (!cartById) throw new Error(`Carrito con ID: ${idCart} no encontrado`)

      // const productIndex = cartById.products.findIndex(
      //   (p) => p.product == idProduct
      // )
      // if (productIndex >= 0) {
      //   cartById.products.splice(productIndex, 1)
      //   await cartById.save()
      // } else {
      //   throw new Error(
      //     `El producto con ID ${idProduct} no se encontró en el carrito con ID ${idCart}`
      //   )
      // }

      // return 'Producto eliminado de carrito con éxito'
    } catch (err) {
      return err.message
    }
  }
}

export default CartManager
