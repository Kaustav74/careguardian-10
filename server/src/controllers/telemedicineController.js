const crypto = require('crypto');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.getDoctors = async (req, res) => {
  const { specialization, available, minRating } = req.query;
  const q = { verified: true };
  if (specialization) q.specialization = specialization;
  if (available !== undefined) q.available = available === 'true';
  if (minRating) q.rating = { $gte: Number(minRating) };
  let doctors = await Doctor.find(q).sort({ rating: -1 });
  if (!doctors.length) {
    await Doctor.insertMany([
      { name: 'Ananya Mehra', specialization: 'General Medicine', available: true, verified: true, consultationFee: 700, rating: 4.7, slots: ['10:00', '11:30', '15:00'] },
      { name: 'Rohit Sinha', specialization: 'Cardiology', available: true, verified: true, consultationFee: 900, rating: 4.8, slots: ['09:00', '13:30'] },
    ]);
    doctors = await Doctor.find(q).sort({ rating: -1 });
  }
  res.json(doctors);
};

exports.bookAppointment = async (req, res) => {
  const { patientId, doctorId, slot } = req.body;
  const patient = await User.findById(patientId) || await User.findOne({ email: 'demo.patient@careguardian.app' });
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  if (!doctor.slots.includes(slot)) return res.status(400).json({ message: 'Invalid slot' });

  const appointment = await Appointment.create({ patient: patient._id, doctor: doctor._id, slot, videoRoomId: crypto.randomUUID(), amount: doctor.consultationFee });
  res.status(201).json(await appointment.populate(['patient', 'doctor']));
};

exports.createVideoSession = async (req, res) => {
  const { appointmentId } = req.body;
  const appt = await Appointment.findById(appointmentId);
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  res.json({ roomId: appt.videoRoomId, provider: 'webrtc-basic', token: crypto.randomUUID() });
};
