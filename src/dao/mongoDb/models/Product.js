import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnails: [
    {
      id: String,
      name: String,
      path: String,
    },
  ],

  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  stock: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  status: { type: Boolean, required: true },
});

export const Product = model("Product", ProductSchema);
