import passport from 'passport'
import local from 'passport-local'
import { User } from '../dao/mongoDb/models/User.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email'
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
          let user = await User.findOne({ email: username })
          if (user) {
            console.log('El usuario ya existe')
            return done(null, false)
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            passport
          }

          let result = await User.create(newUser)

          return done(null, result)
        } catch (error) {
          return done('Error al obtener el usuario: ' + error)
        }
      }
    )
  )
}

export default initializePassport
