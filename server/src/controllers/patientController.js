const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TemporaryPatient = require('../models/TemporaryPatient');
const User = require('../models/User');

exports.createTemporaryPatient = async (req, res) => {
  const { alias, phone, emergencyRequestId, hospitalId } = req.body;
  const tempPatient = await TemporaryPatient.create({
    alias: alias || `Temp-${Date.now().toString().slice(-5)}`,
    phone,
    emergencyRequest: emergencyRequestId,
    hospital: hospitalId,
  });
  res.status(201).json(tempPatient);
};

exports.upgradeTemporaryPatient = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, bloodGroup, allergies, conditions, consentAccepted } = req.body;

  const temp = await TemporaryPatient.findById(id);
  if (!temp || temp.status !== 'active') return res.status(404).json({ message: 'Temporary patient not found' });
  if (!consentAccepted) return res.status(400).json({ message: 'Consent form acceptance is required' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'User with this email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role: 'patient', bloodGroup, allergies, conditions });

  temp.status = 'upgraded';
  temp.consentAccepted = true;
  temp.stabilizedAt = new Date();
  await temp.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user, upgradedFromTemporaryId: temp._id });
};

exports.updateSubscription = async (req, res) => {
  const { userId, plan } = req.body;
  if (!['free', 'premium'].includes(plan)) return res.status(400).json({ message: 'Invalid plan' });
  const user = await User.findByIdAndUpdate(userId, { subscription: plan }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ id: user._id, subscription: user.subscription });
};
