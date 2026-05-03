const mongoose = require('mongoose');

const temporaryPatientSchema = new mongoose.Schema(
  {
    alias: { type: String, required: true },
    phone: String,
    emergencyRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'EmergencyRequest' },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    consentAccepted: { type: Boolean, default: false },
    stabilizedAt: Date,
    status: { type: String, enum: ['active', 'upgraded'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TemporaryPatient', temporaryPatientSchema);
