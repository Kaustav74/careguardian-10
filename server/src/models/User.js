const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'hospital_admin'], default: 'patient' },
    bloodGroup: String,
    allergies: String,
    conditions: String,
    subscription: { type: String, enum: ['free', 'premium'], default: 'free' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
