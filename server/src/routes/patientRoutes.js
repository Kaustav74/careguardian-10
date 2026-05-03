const express = require('express');
const { createTemporaryPatient, upgradeTemporaryPatient } = require('../controllers/patientController');

const router = express.Router();

router.post('/temporary', createTemporaryPatient);
router.post('/temporary/:id/upgrade', upgradeTemporaryPatient);

module.exports = router;
