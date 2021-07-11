const express = require('express')

const router = express.Router()

// Controllers
const authController = require('../../../controllers/auth')

// Middlewares
const protectedRoute = require('../../../middlewares/protectedRoutes')

/* Authentication routers */

router.get('/user', protectedRoute, authController.User)
router.get('/user/active-sessions', protectedRoute, authController.ActiveSessions)
router.post('/user/logout/:sessionId', protectedRoute, authController.Logout)

router.post('/login', authController.Login)
router.post('/register', authController.Register)

router.get('*', function (req, res) {
  res.redirect('/')
})

module.exports = router