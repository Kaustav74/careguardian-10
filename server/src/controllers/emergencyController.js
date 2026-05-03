const EmergencyRequest = require('../models/EmergencyRequest');
const Hospital = require('../models/Hospital');
const User = require('../models/User');

const distance = (a, b) => {
  const dx = (a?.lat || 0) - (b?.lat || 0);
  const dy = (a?.lng || 0) - (b?.lng || 0);
  return Math.sqrt(dx * dx + dy * dy);
};

const assignNearestHospital = async (location) => {
  const hospitals = await Hospital.find();
  if (!hospitals.length) return null;
  return hospitals.reduce((nearest, hospital) => {
    if (!nearest) return hospital;
    return distance(location, hospital.location) < distance(location, nearest.location) ? hospital : nearest;
  }, null);
};

exports.createEmergency = async (req, res) => {
  const { userId, severity = 'high', location } = req.body;

  let patient = null;
  if (userId) patient = await User.findById(userId);
  if (!patient) {
    patient = await User.findOne({ email: 'demo.patient@careguardian.app' });
  }

  const nearestHospital = await assignNearestHospital(location);

  const emergency = await EmergencyRequest.create({
    patient: patient._id,
    hospital: nearestHospital?._id,
    severity,
    location,
    status: 'pending',
  });

  const populated = await emergency.populate(['patient', 'hospital']);
  res.status(201).json(populated);
};

exports.getEmergencies = async (_req, res) => {
  const emergencies = await EmergencyRequest.find().populate(['patient', 'hospital']).sort({ createdAt: -1 });
  res.json(emergencies);
};

exports.updateEmergencyStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const emergency = await EmergencyRequest.findByIdAndUpdate(id, { status }, { new: true }).populate(['patient', 'hospital']);
  if (!emergency) return res.status(404).json({ message: 'Emergency not found' });
  return res.json(emergency);
};
