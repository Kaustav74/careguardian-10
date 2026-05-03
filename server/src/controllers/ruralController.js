const RuralCamp = require('../models/RuralCamp');
const WheelsBooking = require('../models/WheelsBooking');
const User = require('../models/User');

exports.listCamps = async (req, res) => {
  let camps = await RuralCamp.find().sort({ date: 1 }).lean();
  if (!camps.length) {
    await RuralCamp.insertMany([
      { title: 'Monthly Free Health Camp', village: 'Kolar', date: new Date(Date.now() + 7*86400000), ngoPartner: 'Seva Health NGO', services: ['General Checkup', 'BP', 'Diabetes'], capacity: 150 },
      { title: 'Maternal Care Camp', village: 'Hosur', date: new Date(Date.now() + 14*86400000), ngoPartner: 'Rural Women Trust', services: ['ANC', 'Nutrition'], capacity: 80 },
    ]);
    camps = await RuralCamp.find().sort({ date: 1 }).lean();
  }
  res.json(camps);
};

exports.bookWheels = async (req, res) => {
  const { patientId, village, symptoms, ngoPartner } = req.body;
  const patient = await User.findById(patientId) || await User.findOne({ email: 'demo.patient@careguardian.app' });
  const booking = await WheelsBooking.create({ patient: patient?._id, village, symptoms, ngoPartner });
  res.status(201).json(booking);
};

exports.scheduleCamp = async (req, res) => {
  const camp = await RuralCamp.create(req.body);
  res.status(201).json(camp);
};

exports.ngoDirectory = async (_req, res) => {
  res.json([
    { name: 'Seva Health NGO', focus: 'Primary Care', contact: '+91-9000000001' },
    { name: 'Rural Women Trust', focus: 'Maternal & Child Health', contact: '+91-9000000002' },
  ]);
};
