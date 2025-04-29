const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // Firebase UID
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['coach', 'admin'], default: 'coach' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coach', coachSchema);
