const express = require('express')
const router = express.Router()

// Auth routes
const authRoutes = require('./auth')
router.use('/auth', authRoutes)


// Handle 404
router.all('*', function (req, res) {
  res.status(404).send('404 Not found');
})

module.exports = router