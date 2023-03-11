import { Schema, model } from "mongoose";

export const MessageSchema = new Schema({
  id: {
    type: String,
  },
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export const Message = model("Message", MessageSchema);
