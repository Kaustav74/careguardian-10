const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    status: { type: String, enum: ['pending', 'assigned', 'resolved'], default: 'pending' },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'high' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
