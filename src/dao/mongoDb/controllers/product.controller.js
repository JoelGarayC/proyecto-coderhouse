import ProductManager from "../managers/ProductManager.js";

const product = new ProductManager();

export async function getProducts(req, res) {
  const { limit } = req.query;
  try {
    const products = await product.getProducts();
    if (limit) {
      const limitProducts = products.slice(0, limit);
      res.json({
        ok: true,
        products: limitProducts,
      });
      return;
    }
    res.json({
      ok: true,
      products: products,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}

export async function getProductById(req, res) {
  const { pid } = req.params;
  try {
    const response = await product.getProductById(pid);
    res.json({
      ok: true,
      product: response,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}

export async function addProduct(req, res) {
  const { title, description, code, stock, price, category } = req.body;
  try {
    let imagenes = [];

    const stockNumber = parseInt(stock);
    const priceNumber = parseInt(price);
    const newProduct = {
      title,
      description,
      code,
      stock: stockNumber,
      price: priceNumber,
      thumbnails: imagenes,
      category,
    };

    const response = await product.addProduct(newProduct);
    res.json({
      ok: true,
      res: response,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}

export async function updateProductById(req, res) {
  const { title, description, code, stock, price, category } = req.body;
  const { pid } = req.params;
  try {
    let imagenes = [];

    const stockNumber = parseInt(stock);
    const priceNumber = parseInt(price);
    const updateProduct = {
      title,
      description,
      code,
      stock: stockNumber,
      price: priceNumber,
      thumbnails: imagenes,
      category,
    };

    const response = await product.updateProduct(pid, updateProduct);
    res.json({ ok: true, message: response });
  } catch (err) {
    res.json({ error: err.message });
  }
}

export async function deleteProductById(req, res) {
  const { pid } = req.params;
  try {
    const response = await product.deleteProduct(pid);
    res.json({
      ok: true,
      message: response,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}
