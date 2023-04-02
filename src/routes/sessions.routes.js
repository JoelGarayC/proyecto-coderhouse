import express from 'express'
import passport from 'passport'
import {
  login,
  logout,
  profile,
  register
} from '../dao/mongoDb/controllers/sessions.controller.js'

const router = express.Router()

router.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/failregister' }),
  register
)
router.post('/login', login)
router.get('/profile', profile)
router.get('/logout', logout)

router.get('/failregister', async (req, res) => {
  console.log('failed to strategy')
  res.send({
    error: 'failed to register'
  })
})

export default router
