const express = require('express');
const { getDoctors, bookAppointment, createVideoSession } = require('../controllers/telemedicineController');

const router = express.Router();
router.get('/doctors', getDoctors);
router.post('/appointments', bookAppointment);
router.post('/video/session', createVideoSession);

module.exports = router;
