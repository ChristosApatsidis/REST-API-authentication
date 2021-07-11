const mongoose = require("mongoose")

// Define the User model schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    index: { unique: true },
    required: true
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  password: { 
    type: String 
  },
  registeredDate: {
    type: Date,
    default: Date.now 
  },
  lastSignin: {
    type: Date,
    default: Date.now
  },
  activeSessions: [{
    source: String,
    ip: String,
    loginInfo: String,
    date: {type: Date, default: Date.now}
  }],
  accountSuspension: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model("User", UserSchema);