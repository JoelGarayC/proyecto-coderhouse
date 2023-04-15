import bycryptjs from 'bcryptjs'
import mongoose, { Schema, model } from 'mongoose'

export const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    trim: true, // limpiar espacios en blanco al inicio y al final
    lowercase: true, // convertir a minusculas el email
    index: true
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    unique: true,
    sparse: true
  },
  age: Number,
  password: String,
  role: {
    type: String,
    default: 'user'
  }
})

// encriptar password antes de guardar el usuario en la base de datos
UserSchema.pre('save', async function (next) {
  const user = this
  // encriptar password solo si ha sido modificado o es nuevo (no existe)
  if (!user.isModified('password')) return next()

  try {
    const salt = await bycryptjs.genSalt(10)
    const hash = await bycryptjs.hash(user.password, salt)
    user.password = hash
    next()
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// comparar password con el password encriptado de la base de datos
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bycryptjs.compare(candidatePassword, this.password)
}

export const User = model('User', UserSchema)
