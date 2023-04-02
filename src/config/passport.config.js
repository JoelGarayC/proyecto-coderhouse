import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import local from 'passport-local'
import { User } from '../dao/mongoDb/models/User.js'

const LocalStrategy = local.Strategy

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

const initializePassport = () => {
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          let user = await User.findOne({ email: username })
          if (!user) {
            console.log('El usuario no existe')
            return done(null, false)
          }
          const isMatch = await user.comparePassword(password)
          if (!isMatch) return done(null, false)

          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email'
      },
      async (req, username, password, done) => {
        const { first_name, last_name, age, email } = req.body
        try {
          let user = await User.findOne({ email: username })
          if (user) {
            console.log('El usuario ya existe')
            return done(null, false)
          }

          const newUser = {
            first_name,
            last_name,
            password,
            email,
            age
          }

          let result = await User.create(newUser)

          return done(null, result)
        } catch (error) {
          return done('Error al obtener el usuario: ' + error)
        }
      }
    )
  )

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/v1/sessions/github/callback'
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          let user = await User.findOne({ email: profile._json?.email })

          if (!user) {
            let addnewUser = {
              first_name: profile._json.name,
              last_name: '',
              email: profile._json?.email,
              age: 20,
              password: '',
              role: 'user'
            }
            let newUser = await User.create(addnewUser)
            done(null, newUser)
          } else {
            done(null, user)
          }
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    let user = await User.findById({ _id: id })
    done(null, user)
  })
}

export default initializePassport
