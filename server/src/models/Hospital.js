const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    contactNumber: String,
    emergencyCapacity: { type: Number, default: 0 },
    availableBeds: { type: Number, default: 0, index: true },
    occupiedBeds: { type: Number, default: 0 },
    icuAvailable: { type: Boolean, default: false, index: true },
    costCategory: { type: String, enum: ['low', 'medium', 'high'], default: 'medium', index: true },
    facilities: { type: [String], default: [] },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

hospitalSchema.index({ 'location.lat': 1, 'location.lng': 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
