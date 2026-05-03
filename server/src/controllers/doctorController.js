const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { analyzeSymptoms } = require('../services/aiService');
const { generatePrescriptionPdf } = require('../services/prescriptionService');

exports.onboardDoctor = async (req, res) => {
  const doctor = await Doctor.create({ ...req.body, verified: true });
  res.status(201).json(doctor);
};

exports.getDoctorDashboard = async (req, res) => {
  const { doctorId } = req.params;
  const [doctor, appointments] = await Promise.all([
    Doctor.findById(doctorId),
    Appointment.find({ doctor: doctorId }).populate('patient').sort({ createdAt: -1 }),
  ]);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json({ doctor, appointments, earnings: doctor.earningsTotal });
};

exports.updateAvailability = async (req, res) => {
  const { doctorId } = req.params;
  const { available, slots } = req.body;
  const doctor = await Doctor.findByIdAndUpdate(doctorId, { available, slots }, { new: true });
  res.json(doctor);
};

exports.completeConsultation = async (req, res) => {
  const { appointmentId } = req.params;
  const { medicines, advice, summaryInput } = req.body;
  const appt = await Appointment.findById(appointmentId).populate(['doctor', 'patient']);
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });

  const ai = await analyzeSymptoms({ symptoms: summaryInput || 'Consultation notes', history: advice });
  const prescriptionUrl = await generatePrescriptionPdf({
    appointmentId,
    doctorName: appt.doctor.name,
    patientName: appt.patient.name,
    medicines,
    advice,
  });

  appt.status = 'completed';
  appt.consultationSummary = ai.summary;
  appt.prescriptionUrl = prescriptionUrl;
  appt.paymentStatus = 'paid';
  await appt.save();

  await Doctor.findByIdAndUpdate(appt.doctor._id, { $inc: { earningsTotal: appt.amount || appt.doctor.consultationFee } });
  res.json(appt);
};

exports.getConsultationHistory = async (req, res) => {
  const { patientId } = req.params;
  const history = await Appointment.find({ patient: patientId, status: 'completed' }).populate('doctor').sort({ updatedAt: -1 });
  res.json(history);
};
