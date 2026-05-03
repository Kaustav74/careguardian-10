const Joi = require('joi');

exports.createEmergencySchema = Joi.object({
  userId: Joi.string().optional(),
  severity: Joi.string().valid('low', 'medium', 'high').optional(),
  symptoms: Joi.string().allow('', null).optional(),
  age: Joi.number().min(0).max(120).optional(),
  history: Joi.string().allow('', null).optional(),
  location: Joi.object({ lat: Joi.number().required(), lng: Joi.number().required() }).required(),
});
