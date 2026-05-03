const express = require('express');
const { createTemporaryPatient, upgradeTemporaryPatient, updateSubscription } = require('../controllers/patientController');

const router = express.Router();

router.post('/temporary', createTemporaryPatient);
router.post('/temporary/:id/upgrade', upgradeTemporaryPatient);
router.patch('/subscription', updateSubscription);

module.exports = router;
