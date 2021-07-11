const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs')
const randomQuotes = require('random-quotes')
const User = require('../models/user')

const privateKey = fs.readFileSync('./config/id_rsa_priv.pem')

module.exports.Login = async function(req, res){
  const { email, password } = req.body
  // Check if request body has all json fields are required
  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: 'email and password is required'
    })
  }
  // Check if user with email exist
  const user = await User.findOne({ email }).catch((err) => {
    return res.status(505).json({
      success: false,
      message: 'Error processing the request'
    })
  })
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User not exist' 
    })
  }
  // Check password
  const hashPassword = user.password
  const checkPassword = bcrypt.compareSync(password, hashPassword);
  if (!checkPassword) {
    return res.status(401).json({
      success: false,
      message: "Incorrect password"
    })
  }
  // Sign jwt token
  const jsonWebToken = jwt.sign({ id: user._id }, privateKey, { algorithm: 'RS256'});
  var [ header, loginInfo, secure ] = jsonWebToken.split(".")
  // Save activeSessions activity and update lastSignin
  const source = req.headers['user-agent']
  const ip = req.connection.remoteAddress
  user.activeSessions.push({ source, ip, loginInfo })
  user.lastSignin = Date.now();
  await user.save()
  // client id
  const clientId = user.activeSessions[user.activeSessions.length-1]._id
  // Quote
  const quote = randomQuotes.default().body
  // return final
  return res.status(200).json({
    success: true,
    sessionData:{
      loginInfo,
      secure,
      clientId
    },
    quote
  })
}


module.exports.Register = async function(req, res){
  const { email, firstname, lastname, password } = req.body
  // Check if request body has all json fields are required
  if (!email || !firstname || !lastname || !password) {
    return res.status(401).json({
      success: false,
      message: 'email, firstnme, lstname, password is required'
    })
  }
  // Check if user with same email already exist
  const user = await User.findOne({ email }).catch((err) => {
    return res.status(505).json({
      success: false,
      message: 'Error processing the request'
    })
  })
  if (user) {
    return res.status(401).json({
      success: false,
      message: 'User exist'
    })
  }
  // Hashing the password
  const hashPassword = bcrypt.hashSync(password, 10);
  // Create new user and save it
  const newUser = new User({
    email,
    firstname,
    lastname,
    password: hashPassword 
  })
  try {
    await newUser.save()
  } catch(err) {
    return res.status(505).json({
      success: false,
      message: 'Error processing the request' 
    })
  }
  // Sign jwt token
  const jsonWebToken = jwt.sign({ id: newUser.id }, privateKey, { algorithm: 'RS256'});
  var [ header, loginInfo, secure ] = jsonWebToken.split(".")
  // Save login activity
  const source = req.headers['user-agent']
  const ip = req.connection.remoteAddress
  newUser.activeSessions.push({ source, ip, loginInfo })
  await newUser.save()
  // client id
  const clientId = newUser.activeSessions[newUser.activeSessions.length-1]._id
  // Quote
  const quote = randomQuotes.default().body
  // return final
  return res.status(200).json({
    success: true,
    userData: {
      email,
      firstname,
      lastname
    },
    sessionData: {
      loginInfo,
      secure,
      clientId
    },
    quote
  })
}


module.exports.ActiveSessions = async function(req, res){
  const user = res.locals.user
  return res.status(200).json({
    success: true,
    activeSessions: user.activeSessions
  })
}


module.exports.Logout = async function(req, res){
  const user = res.locals.user
  const id = req.params.sessionId
  if (id.length !== 24) {
    return res.status(505).json({
      success: false,
      message: 'Error processing the request'
    })
  }
  const logoutuser = await User.findOne( 
    { _id: user.id, "activeSessions": {$elemMatch: {_id: id } } }
  )
  console.log(logoutuser)
  if (!logoutuser) {
    return res.status(505).json({
      success: false,
      message: 'Error processing the request'
    })
  } else {
    await User.findOneAndUpdate( 
      { _id: user.id },
      { $pull: { activeSessions: { _id : id } } },
      { safe: true }
    )
  }
  return res.status(200).json({
    success: true
  })
}


module.exports.User = async function(req, res){
  const user = res.locals.user
  return res.status(200).json({
    success: true,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname
  })
}