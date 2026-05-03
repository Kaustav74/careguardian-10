const express = require('express');
const { onboardDoctor, getDoctorDashboard, updateAvailability, completeConsultation, getConsultationHistory } = require('../controllers/doctorController');

const router = express.Router();
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
router.post('/onboard', auth, authorizeRoles('admin'), onboardDoctor);
router.get('/:doctorId/dashboard', auth, authorizeRoles('doctor'), getDoctorDashboard);
router.patch('/:doctorId/availability', auth, authorizeRoles('doctor'), updateAvailability);
router.post('/appointments/:appointmentId/complete', auth, authorizeRoles('doctor'), completeConsultation);
router.get('/patients/:patientId/history', auth, authorizeRoles('doctor'), getConsultationHistory);

module.exports = router;
