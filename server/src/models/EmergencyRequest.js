const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'resolved'], default: 'pending' },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'high' },
    priority: { type: Number, default: 0 },
    department: { type: String, enum: ['ER', 'Cardiology', 'Neurology', 'Orthopedics'], default: 'ER' },
    location: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
