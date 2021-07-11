const express = require('express')
const router = express.Router()

/* Application routers */

// API V1.0 routes
const api_v1 = require('./api/v1')
router.use('/api/v1', api_v1)


// Index route
router.get('/', function (req, res) {
  res.status('200').send('index')
})

// Handle 404
router.all('*', function (req, res) {
  res.status(404).send('404 Not found');
})

module.exports = router