export async function login(req, res) {
  try {
    if (!req.user)
      return res
        .status(400)
        .send({ status: 'error', message: 'Credenciales incorrectos' })

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: 'user'
    }

    res.redirect('/products')
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}

export async function register(req, res) {
  try {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: 'user'
    }
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
