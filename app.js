require('dotenv').config()
require('./config/database')
const express = require('express')
const helmet = require("helmet")
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const app = express()

const routes = require('./routes')
const port = process.env.PORT

const corsOptions = {
  origin: '127.0.0.1',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Allow the app accepts incoming json request
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Helmet setting various HTTP headers
app.use(helmet())
// Cors
app.use(cors(corsOptions))
// Morgan logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
// Get cookies from request
app.use(cookieParser())

// Routes
app.use(routes)

// Start http server
app.listen(port, () => {
  console.log(`Example app listening at http://127.0.0.1:${port}`)
})