const { analyzeSymptoms } = require('../services/aiService');
const { triage } = require('../services/triageService');
const Hospital = require('../models/Hospital');

const normalizeAnalyzeResponse = (analysis = {}) => ({
  severity: ['low', 'medium', 'high'].includes(analysis.severity) ? analysis.severity : 'medium',
  recommendation: analysis.recommendation || analysis.next_steps || 'Consult a licensed doctor for accurate medical guidance.',
  specialist: analysis.specialist || analysis.suggested_specialization || 'General Physician',
});


exports.analyzeSymptoms = async (req, res) => {
  const { symptoms, age, history } = req.body;
  if (!symptoms) return res.status(400).json({ message: 'symptoms are required' });

  const analysis = await analyzeSymptoms({ symptoms, age, history });
  res.json(normalizeAnalyzeResponse(analysis));
};

exports.triage = async (req, res) => {
  const { symptoms, age, history } = req.body;
  if (!symptoms) return res.status(400).json({ message: 'symptoms are required' });

  const nearbyHospitals = await Hospital.find().select('name availableBeds icuAvailable location').lean();
  const result = await triage({ symptoms, age, history, nearbyHospitals });
  res.json(result);
};
