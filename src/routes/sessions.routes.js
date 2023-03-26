import express from 'express'
import {
  login,
  logout,
  profile,
  register
} from '../dao/mongoDb/controllers/sessions.controller.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', profile)
router.get('/logout', logout)

export default router
