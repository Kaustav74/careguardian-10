const express = require('express');
const { listCamps, bookWheels, scheduleCamp, ngoDirectory } = require('../controllers/ruralController');

const router = express.Router();
router.get('/camps', listCamps);
router.post('/wheels/book', bookWheels);
router.post('/camps', scheduleCamp);
router.get('/ngos', ngoDirectory);

module.exports = router;
