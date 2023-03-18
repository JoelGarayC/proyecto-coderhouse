import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnails: [
    {
      name: String,
      path: String
    }
  ],

  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  stock: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  status: { type: Boolean, required: true }
})

ProductSchema.plugin(mongoosePaginate)

export const Product = model('Product', ProductSchema)
