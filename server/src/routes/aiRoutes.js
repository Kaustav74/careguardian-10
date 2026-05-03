const express = require('express');
const { analyzeSymptoms } = require('../controllers/aiController');

const router = express.Router();

router.post('/analyze-symptoms', analyzeSymptoms);

module.exports = router;
