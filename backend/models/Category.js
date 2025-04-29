const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
  ageGroup: { type: String, required: true },
  weightClass: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
