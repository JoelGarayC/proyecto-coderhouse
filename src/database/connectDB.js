import mongoose from "mongoose";

const MONGODB_URI =
  process.env.NODE_ENV === "production"
    ? `mongodb+srv://Joel:${process.env.DB_PASSWORD}@cluster0.pqiwc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    : `mongodb://127.0.0.1:27017/${process.env.DB_NAME ?? "ecommerce"}`;

export const connectDB = async () => {
  try {
    const res = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Base de datos conectado a: ${res.connection.host}`);
  } catch (error) {
    console.log("Error en la conección " + error);
  }
};
