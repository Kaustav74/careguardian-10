const express = require('express');
const { createEmergency, getEmergencies, updateEmergencyStatus } = require('../controllers/emergencyController');

const router = express.Router();

router.post('/', createEmergency);
router.get('/', getEmergencies);
router.patch('/:id/status', updateEmergencyStatus);

module.exports = router;
