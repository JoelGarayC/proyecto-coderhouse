import CartManager from "../managers/CartManager.js";

const cart = new CartManager();

export async function getCarts(req, res) {
  try {
    const response = await cart.getCarts();
    res.json({
      ok: true,
      carts: response,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}

export async function getCartById(req, res) {
  const { cid } = req.params;
  try {
    const response = await cart.getCartById(cid);
    res.json({
      ok: true,
      cart: response,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}

export async function addCart(req, res) {
  try {
    const response = await cart.addCart();
    res.json({
      ok: true,
      message: response,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}

export async function addProductToCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const response = await cart.addProduct(cid, pid);
    res.json({
      ok: true,
      message: response,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}
