const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true, index: true },
  available: { type: Boolean, default: true, index: true },
  rating: { type: Number, default: 4.5 },
  slots: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
