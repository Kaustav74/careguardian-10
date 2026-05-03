const Hospital = require('../models/Hospital');
const EmergencyRequest = require('../models/EmergencyRequest');
const { logAction } = require('../services/auditService');

exports.updateBeds = async (req, res) => {
  const { hospitalId, occupiedBeds } = req.body;
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
  hospital.occupiedBeds = occupiedBeds;
  await hospital.save();
  await logAction({ action: 'bed_update', hospitalId, metadata: { occupiedBeds } });
  res.json(hospital);
};

exports.getDepartmentQueues = async (req, res) => {
  const queues = await EmergencyRequest.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } },
    { $project: { department: '$_id', count: 1, _id: 0 } },
  ]);
  res.json(queues);
};

exports.getAnalytics = async (req, res) => {
  const inflow = await EmergencyRequest.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const avgResponse = await EmergencyRequest.aggregate([
    { $match: { status: 'accepted' } },
    { $project: { mins: { $divide: [{ $subtract: ['$updatedAt', '$createdAt'] }, 60000] } } },
    { $group: { _id: null, avgMinutes: { $avg: '$mins' } } },
  ]);

  const beds = await Hospital.find().select('name availableBeds occupiedBeds').lean();
  const bedUtilization = beds.map((h) => ({ name: h.name, utilization: h.availableBeds ? Math.round(((h.occupiedBeds || 0) / h.availableBeds) * 100) : 0 }));

  res.json({
    dailyInflow: inflow.map((i) => ({ date: i._id, count: i.count })),
    emergencyResponseTime: avgResponse[0]?.avgMinutes || 0,
    bedUtilization,
  });
};
