import fs from "fs";
import path from "path";
import pathBase from "../utils/pathBase.js";
import {
  validateExistCode,
  validateFields,
  validateFileJson,
  validateOther,
  validateType,
} from "../utils/validations.js";

const filePath = path.join(`${pathBase}/src/store/products.json`);

class ProductManager {
  constructor() {
    this.path = filePath;
  }

  async getProducts() {
    try {
      // validacion si existe el archivo products.json
      validateFileJson(this.path);

      let data = await fs.promises.readFile(this.path, "utf-8");
      if (!data) return [];
      return JSON.parse(data);
    } catch (err) {
      return err.message;
    }
  }

  async getProductById(id) {
    try {
      if (!id) throw new Error("Falta el Id del producto");

      const products = await this.getProducts();

      const productById = products.find((product) => product.id === id);
      if (!productById) return `Producto con ID: ${id} no encontrado`;
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

      // obtencion de la BD de products
      const products = await this.getProducts();

      // validacion si existe el codigo en la lista
      validateExistCode(product, products);

      // creacion de un id autoincrementable para el producto
      let id =
        products.length === 0
          ? 1
          : parseInt(products[products.length - 1].id) + 1;
      id = id.toString();

      // agregacion del producto a la lista de productos
      await fs.promises.writeFile(
        this.path,
        JSON.stringify([...products, { id, ...product }]),
        "utf-8"
      );
      return "Producto agregado a products.json con éxito";
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
      // validacion de los campos y tipos
      validateFields(newProduct);
      validateType(newProduct);
      validateOther(newProduct);

      if (!id) throw new Error("Falta el Id del producto");

      // obtencion de la BD de products
      const products = await this.getProducts();

      // validacion si existe el codigo en la lista
      let updateProd = products.find((prod) => prod.id === id);
      if (!updateProd)
        throw new Error(
          `Producto con ID: "${id}" no se encontró en la lista, no se pudo actualizar!`
        );

      // obtencion del indice del producto
      const productIndex = products.findIndex((prod) => prod.id === id);
      products[productIndex] = { ...updateProd, ...newProduct };

      //actualizando la lista de productos
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return `Producto con ID: ${id} actualizado con éxito!`;
    } catch (error) {
      return error.message;
    }
  }

  async deleteProduct(id) {
    try {
      if (!id) throw new Error("Falta el Id del producto");
      // obtencion de la BD de products
      const products = await this.getProducts();

      // validacion si existe el codigo en la lista
      let idProd = products.some((prod) => prod.id === id);
      if (!idProd)
        throw new Error(
          `Producto con ID: "${id}" no se encontró en la lista, no se pudo eliminarlo!`
        );

      // filtrando la lista de productos
      const productsF = products.filter((prod) => prod.id !== id);

      //actualizando la lista de productos
      await fs.promises.writeFile(this.path, JSON.stringify(productsF));
      return `Producto con ID: "${id}" eliminado correctamente`;
    } catch (error) {
      return error.message;
    }
  }
}

export default ProductManager;
