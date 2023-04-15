import CartManager from '../dao/mongoDb/managers/CartManager.js'
import { User } from '../dao/mongoDb/models/User.js'

const cart = new CartManager()

export const checkCart = async (req, res, next) => {
  try {
    const existInUser = await User.findOne({
      _id: req.user._id,
      cart: { $exists: true }
    })

    // Si no existe el id del carrito en el id del usuario, entonces crea uno nuevo
    if (!existInUser) {
      const { id: idCart } = await cart.addCart()
      // Busca al usuario por su identificador único y actualiza su propiedad 'cart'
      if (idCart) {
        await User.findOneAndUpdate(
          { _id: req.user._id },
          { $set: { cart: idCart } },
          { new: true }
        )
      }
    }

    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
