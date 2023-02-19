import fs from "fs";
import { validateFileJson } from "../utils/validations.js";
import ProductManager from "./ProductManager.js";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      // validacion si existe el archivo cart.json
      validateFileJson(this.path);
      let data = await fs.promises.readFile(this.path, "utf-8");
      if (!data) return [];
      return JSON.parse(data);
    } catch (err) {
      return err.message;
    }
  }

  async getCartById(id) {
    try {
      if (!id) throw new Error("Falta el ID del carrito");

      const carts = await this.getCarts();

      const cartById = carts.find((c) => c.id === id);
      if (!cartById) return `Carrito con ID: "${id}" no encontrado`;
      return cartById;
    } catch (err) {
      return err.message;
    }
  }

  async addCart() {
    try {
      const carts = await this.getCarts();

      // creacion de un id autoincrementable para el carrito
      let id =
        carts.length === 0 ? 1 : parseInt(carts[carts.length - 1].id) + 1;
      id = id.toString();

      await fs.promises.writeFile(
        this.path,
        JSON.stringify([...carts, { id, products: [] }]),
        "utf-8"
      );
      return `Carrito con ID: "${id}" agregado a cart.json con éxito`;
    } catch (err) {
      return err.message;
    }
  }

  async addProduct(idCart, idProduct) {
    try {
      const carts = await this.getCarts();
      // si existe el id del carrito en la lista
      const cart = carts.find((c) => c.id === idCart);
      if (!cart)
        throw new Error(`Carrito con ID: "${idCart}" no existe en la lista`);

      // si existe el id del producto en la lista
      const prodManager = new ProductManager();
      const isExistProd = await prodManager.getProductById(idProduct);
      if (typeof isExistProd === "string") throw new Error(isExistProd);

      // agregando la lista de productos a su respectivo carrito
      let newProd = {
        product: idProduct,
        quantity: 1,
      };
      // Si el producto tiene  el mismo id , aumenta la cantidad
      const isId = cart.products.some((p) => p.product === idProduct);
      if (isId) {
        const existingProduct = cart.products.find(
          (p) => p.product === idProduct
        );
        newProd.quantity = existingProduct.quantity + 1;
        cart.products = cart.products.filter((p) => p.product !== idProduct);
      }
      cart.products.push(newProd);

      await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");

      return (
        "Producto agregado a carrito con éxito al carrito con ID: " + idCart
      );
    } catch (err) {
      return err.message;
    }
  }
}

export default CartManager;
