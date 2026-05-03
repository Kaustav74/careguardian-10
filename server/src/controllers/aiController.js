const { analyzeSymptoms } = require('../services/aiService');

exports.analyzeSymptoms = async (req, res) => {
  const { symptoms, age, history } = req.body;
  if (!symptoms) return res.status(400).json({ message: 'symptoms are required' });

  const analysis = await analyzeSymptoms({ symptoms, age, history });
  res.json(analysis);
};
