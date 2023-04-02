import { User } from '../models/User.js'

export async function login(req, res) {
  const { email, password } = req.body
  try {
    if (!email || !password) return res.json(`Complete todos los campos`)

    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      req.session.user = {
        first_name: 'admin Coder',
        email: email,
        role: 'admin'
      }
      res.redirect('/products')
      return
    }
    const findUser = await User.findOne({ email })

    if (!findUser)
      return res
        .status(400)
        .json({ msg: 'El correo no existe, por favor registrate' })

    // comparar password con el password encriptado de la base de datos
    const isMatch = await findUser.comparePassword(password)
    if (!isMatch)
      return res.status(401).json({ msg: 'Su contraseña es incorrecta' })

    req.session.user = {
      first_name: findUser.first_name,
      last_name: findUser.last_name,
      email: findUser.email,
      age: findUser.age,
      role: findUser.role
    }

    res.redirect('/products')
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}

export async function register(req, res) {
  try {
    const { first_name, last_name, email, age, password } = req.body
    if (!first_name || !last_name || !email || !age || !password)
      return res.json(`Complete todos los campos`)

    const newUser = await User.create({
      email,
      password,
      first_name,
      last_name,
      age,
      role: 'user'
    })

    newUser.save()

    req.session.user = { first_name, last_name, email, age, role: 'user' }
    res.json(`Registro exitoso`)
  } catch (error) {
    console.log(error.message)
    // el error 11000 es un error de duplicado de email en la base de datos
    if (error.code === 11000)
      return res
        .status(400)
        .json({ msg: 'El correo ya está registrado, Inicie sesión' })

    res.status(500).json({ error: 'Error del servidor' })
  }
}

export async function logout(req, res) {
  req.session.destroy((err) => {
    if (!err) return res.redirect('/login')

    res.send({
      message: `Logout error`,
      body: err
    })
  })
}

export async function profile(req, res) {}

export async function update(req, res) {}
