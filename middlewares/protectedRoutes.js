const jwt = require('jsonwebtoken');
const fs = require('fs')
const User = require('../models/user')

const publicKey = fs.readFileSync('./config/id_rsa_pub.pem')

module.exports = async function(req, res, next) {
  const header = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9"
  const payload = req.cookies.login_info
  const signature = req.cookies.secure
  const jsonWebToken = header+"."+payload+"."+signature
  // Check if authorization cookies exist in request
  if (!payload || !signature) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  // Verify jsonwebtoken
  jwt.verify(jsonWebToken, publicKey, async function(err, decoded) {
    if (err) {
      return res.status(505).json({
        success: false,
        message: 'Error processing the request'
      })
    }
    // Check if user exist and if has active session
    const user = await User.findOne({ _id: decoded.id, "activeSessions": {$elemMatch: {loginInfo: payload}} })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
    } else {
      res.locals.user = user
      next()
    }
  })
}