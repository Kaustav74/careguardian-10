const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  slot: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'active', 'completed', 'cancelled'], default: 'scheduled' },
  videoRoomId: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  amount: { type: Number, default: 0 },
  prescriptionUrl: String,
  consultationSummary: String,
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
