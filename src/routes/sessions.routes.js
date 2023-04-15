import express from 'express'
import passport from 'passport'
import {
  login,
  logout,
  profile,
  register
} from '../dao/mongoDb/controllers/sessions.controller.js'
import { authorization } from '../middlewares/authorization.js'
import { checkCart } from '../middlewares/checkCart.js'

const router = express.Router()

router.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/failregister' }),
  register
)
router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/faillogin' }),
  checkCart,
  login
)
router.get('/profile', profile)
router.get('/logout', logout)

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async (req, res) => {}
)

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  checkCart,
  async (req, res) => {
    try {
      req.session.user = req.user
      res.redirect('/profile')
    } catch (error) {
      console.log(error)
    }
  }
)

router.get('/current', authorization('user'), async (req, res) => {
  res.send(req.user)
})

export default router
