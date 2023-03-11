import mongoose from "mongoose";
import {
  validateFields,
  validateOther,
  validateType,
} from "../../../utils/validations.js";
import { Product } from "../models/Product.js";
const { ObjectId } = mongoose.Types;

class ProductManager {
  async getProducts(limit) {
    try {
      if (limit) {
        return await Product.find().limit(limit).lean();
      }
      const data = await Product.find();
      if (!data) return [];
      return data;
    } catch (err) {
      return err.message;
    }
  }

  async getProductById(id) {
    try {
      if (!ObjectId.isValid(id)) throw new Error(`El ID ${id} no es válido`);

      const productById = await Product.findById(id);
      if (!productById) throw new Error(`Producto con ID: ${id} no encontrado`);
      return productById;
    } catch (err) {
      return err.message;
    }
  }

  async addProduct({
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    category,
    status = true,
  }) {
    const product = {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      category,
      status,
    };

    try {
      // validacion de los campos y tipos
      validateFields(product);
      validateType(product);
      validateOther(product);

      //validacion del nombre de producto
      const productTitle = await Product.findOne({ title }).lean();
      if (productTitle)
        throw new Error("El título del producto ya existe, escribe otro!");

      // validacion si existe el codigo en la lista
      const productCode = await Product.findOne({ code }).lean();
      if (productCode)
        throw new Error(
          `El código "${code}" ya existe en la lista, escribe otro!`
        );

      // agregacion de producto
      const newProduct = new Product(product);
      await newProduct.save();

      return "Producto agregado con éxito";
    } catch (err) {
      return err.message;
    }
  }

  async updateProduct(
    id,
    {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      category,
      status = true,
    }
  ) {
    const newProduct = {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      category,
      status,
    };

    try {
      if (!ObjectId.isValid(id)) throw new Error(`El ID ${id} no es válido`);

      //busca el producto por id en la base de datos
      const res = await Product.findById(id);
      if (!res)
        throw new Error(`No se encontró un producto con el ID: "${id}"`);

      // validacion de los campos y tipos
      validateFields(newProduct);
      validateType(newProduct);
      validateOther(newProduct);

      //validacion del nombre de producto, exluye el producto ingresado
      const productTitle = await Product.findOne({
        _id: { $ne: id },
        title: newProduct.title,
      }).lean();
      if (productTitle)
        throw new Error("El título del producto ya existe, escribe otro!");

      //validacion del code de producto, excluye el producto ingresado
      const productCode = await Product.findOne({
        _id: { $ne: id },
        code: newProduct.code,
      }).lean();
      if (productCode)
        throw new Error("El código del producto ya existe, escribe otro!");

      // actualizar el producto
      await Product.findByIdAndUpdate(id, newProduct);
      return `Producto con ID: "${id}" actualizado con éxito!`;
    } catch (error) {
      return error.message;
    }
  }

  async deleteProduct(id) {
    try {
      // validacion del ID
      if (!ObjectId.isValid(id)) throw new Error(`El ID ${id} no es válido`);

      //elimina el producto de la base de datos
      const isDeletedProd = await Product.findByIdAndDelete(id);
      if (!isDeletedProd)
        throw new Error(`No se encontró un producto con el ID "${id}"`);

      return `Producto con ID: "${id}" eliminado correctamente`;
    } catch (error) {
      return error.message;
    }
  }
}

export default ProductManager;
