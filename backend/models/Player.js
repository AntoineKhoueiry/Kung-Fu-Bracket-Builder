const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
  competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition' },
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  gender: { type: String, required: true },
  club: { type: String },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', playerSchema);