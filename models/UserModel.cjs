const mongoose = require("mongoose");  // CommonJS

const userSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
    unique: false,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel; 
