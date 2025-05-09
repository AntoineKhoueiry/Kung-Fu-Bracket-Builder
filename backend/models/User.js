const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
  age: Number,
  weight: Number,
  category: String,
});

module.exports = mongoose.model('User', userSchema);
