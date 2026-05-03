const express = require('express');
const { updateBeds, getDepartmentQueues, getAnalytics } = require('../controllers/hospitalOpsController');

const router = express.Router();
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
router.patch('/beds', auth, authorizeRoles('admin'), updateBeds);
router.get('/queues', auth, authorizeRoles('admin'), getDepartmentQueues);
router.get('/analytics', auth, authorizeRoles('admin'), getAnalytics);

module.exports = router;
