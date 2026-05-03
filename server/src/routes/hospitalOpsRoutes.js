const express = require('express');
const { updateBeds, getDepartmentQueues, getAnalytics } = require('../controllers/hospitalOpsController');

const router = express.Router();
router.patch('/beds', updateBeds);
router.get('/queues', getDepartmentQueues);
router.get('/analytics', getAnalytics);

module.exports = router;
