const validate = require('../middleware/validate');
const { createEmergencySchema } = require('../validators/emergencyValidators');
const express = require('express');
const { createEmergency, getEmergencies, updateEmergencyStatus } = require('../controllers/emergencyController');

const router = express.Router();

router.post('/', validate(createEmergencySchema), createEmergency);
router.get('/', getEmergencies);
router.patch('/:id/status', updateEmergencyStatus);

module.exports = router;
