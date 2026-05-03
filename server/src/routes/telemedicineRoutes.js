const express = require('express');
const { getDoctors, bookAppointment, createVideoSession, startAppointment, completeAppointment } = require('../controllers/telemedicineController');

const router = express.Router();
router.get('/doctors', getDoctors);
router.post('/appointments', bookAppointment);
router.patch('/appointments/:id/start', startAppointment);
router.patch('/appointments/:id/complete', completeAppointment);
router.post('/video/session', createVideoSession);

module.exports = router;
