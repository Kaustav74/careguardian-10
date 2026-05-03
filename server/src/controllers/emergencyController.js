let io = null;
exports.setSocketServer = (socketServer) => { io = socketServer; };

const EmergencyRequest = require('../models/EmergencyRequest');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const { analyzeSymptoms } = require('../services/aiService');
const TemporaryPatient = require('../models/TemporaryPatient');
const { getPagination } = require('../services/paginationService');
const { listEmergencies } = require('../services/emergencyService');
const eventBus = require('../events/eventBus');
const { dispatchAmbulance } = require('../services/realtimeService');
const { logAction } = require('../services/auditService');

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
  const { userId, severity = 'high', location, symptoms, age, history, department='ER' } = req.body;

  let patient = null;
  if (userId) patient = await User.findById(userId);
  if (!patient) {
    patient = await User.findOne({ email: 'demo.patient@careguardian.app' });
  }

  let computedSeverity = severity;
  if (symptoms) {
    const analysis = await analyzeSymptoms({ symptoms, age, history });
    computedSeverity = analysis.severity || severity;
  }

  const nearestHospital = await assignNearestHospital(location);

  const emergency = await EmergencyRequest.create({
    patient: patient._id,
    hospital: nearestHospital?._id,
    severity: computedSeverity,
    location,
    status: 'pending',
    priority: (patient.subscription === 'premium' ? 2 : 1) + (computedSeverity === 'critical' ? 2 : computedSeverity === 'high' ? 1 : 0),
    department,
  });

  const populated = await emergency.populate(['patient', 'hospital']);

  let temporaryPatient = null;
  if (!userId) {
    temporaryPatient = await TemporaryPatient.create({
      alias: `Temp-${Date.now().toString().slice(-5)}`,
      emergencyRequest: emergency._id,
      hospital: nearestHospital?._id,
    });
  }

  const payload = { ...populated.toObject(), temporaryPatientId: temporaryPatient?._id };
  if (io) io.emit('emergency:new', payload);
  eventBus.emit('emergency_created', payload);
  res.status(201).json(payload);
};

exports.getEmergencies = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const emergencies = await listEmergencies({ skip, limit });
  res.json({ page, limit, data: emergencies });
};

exports.updateEmergencyStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const emergency = await EmergencyRequest.findByIdAndUpdate(id, { status }, { new: true }).populate(['patient', 'hospital']);
  if (!emergency) return res.status(404).json({ message: 'Emergency not found' });
  if (io) io.emit('emergency:updated', emergency);
  await logAction({ action: `emergency_${status}`, emergencyId: emergency._id, hospitalId: emergency.hospital?._id, metadata: { status } });
  if (status === 'accepted') {
    eventBus.emit('emergency_accepted', emergency);
    dispatchAmbulance({ emergencyId: emergency._id, start: emergency.location || { lat: 28.61, lng: 77.2 } });
  }
  if (status === 'rejected') {
    eventBus.emit('emergency_rejected', emergency);
  }
  return res.json(emergency);
};
