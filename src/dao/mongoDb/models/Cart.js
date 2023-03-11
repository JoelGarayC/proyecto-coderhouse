import { Schema, model } from "mongoose";

export const CartSchema = new Schema({
  id: {
    type: String,
  },
  products: [
    {
      id: String,
      quantity: Number,
    },
  ],
});

export const Cart = model("Cart", CartSchema);
