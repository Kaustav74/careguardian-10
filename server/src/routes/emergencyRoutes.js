const validate = require('../middleware/validate');
const { createEmergencySchema } = require('../validators/emergencyValidators');
const express = require('express');
const { createEmergency, getEmergencies, updateEmergencyStatus } = require('../controllers/emergencyController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', validate(createEmergencySchema), createEmergency);
router.get('/', auth, getEmergencies);
router.patch('/:id/status', auth, updateEmergencyStatus);

module.exports = router;
