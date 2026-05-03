const express = require('express');
const { onboardDoctor, getDoctorDashboard, updateAvailability, completeConsultation, getConsultationHistory } = require('../controllers/doctorController');

const router = express.Router();
router.post('/onboard', onboardDoctor);
router.get('/:doctorId/dashboard', getDoctorDashboard);
router.patch('/:doctorId/availability', updateAvailability);
router.post('/appointments/:appointmentId/complete', completeConsultation);
router.get('/patients/:patientId/history', getConsultationHistory);

module.exports = router;
