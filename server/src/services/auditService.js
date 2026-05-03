const AuditLog = require('../models/AuditLog');
exports.logAction = async (payload) => AuditLog.create(payload);
