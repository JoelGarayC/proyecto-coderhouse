import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnails: [
    {
      name: String,
      path: String,
    },
  ],

  code: { type: String, required: true },
  stock: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  status: { type: Boolean, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

export const Product = model("Product", ProductSchema);