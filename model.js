const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  email: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
});

const User = mongoose.model("user", userSchema);
module.exports = User;
