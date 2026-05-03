const mongoose = require('mongoose');

const wheelsBookingSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  village: { type: String, required: true },
  symptoms: { type: String, required: true },
  status: { type: String, enum: ['pending', 'assigned', 'completed'], default: 'pending' },
  ngoPartner: String,
}, { timestamps: true });

module.exports = mongoose.model('WheelsBooking', wheelsBookingSchema);
