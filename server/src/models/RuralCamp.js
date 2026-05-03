const mongoose = require('mongoose');

const ruralCampSchema = new mongoose.Schema({
  title: { type: String, required: true },
  village: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  ngoPartner: { type: String, required: true },
  services: { type: [String], default: [] },
  capacity: { type: Number, default: 100 },
  booked: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('RuralCamp', ruralCampSchema);
