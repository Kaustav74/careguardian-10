const EmergencyRequest = require('../models/EmergencyRequest');

exports.listEmergencies = async ({ skip, limit }) => EmergencyRequest.find().populate(['patient', 'hospital']).sort({ priority: -1, createdAt: -1 }).skip(skip).limit(limit);
