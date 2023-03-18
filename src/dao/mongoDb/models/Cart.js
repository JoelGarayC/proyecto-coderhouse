import mongoose, { Schema, model } from 'mongoose'

export const CartSchema = new Schema({
  products: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number
    }
  ]
})

export const Cart = model('Cart', CartSchema)
