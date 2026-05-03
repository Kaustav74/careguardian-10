const express = require('express');
const { analyzeSymptoms, triage } = require('../controllers/aiController');

const router = express.Router();

router.post('/analyze-symptoms', analyzeSymptoms);
router.post('/triage', triage);

module.exports = router;
