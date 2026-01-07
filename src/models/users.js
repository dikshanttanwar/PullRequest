const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
