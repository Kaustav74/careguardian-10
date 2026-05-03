const { analyzeSymptoms } = require('./aiService');
const { getCache, setCache } = require('./aiCacheService');

const normSeverity = (s) => {
  if (!s) return 'medium';
  if (['high', 'critical'].includes(s)) return 'critical';
  if (s === 'low') return 'low';
  return 'medium';
};

exports.triage = async ({ symptoms, age, history, nearbyHospitals = [] }) => {
  const key = JSON.stringify({ symptoms, age, history, nearbyHospitals: nearbyHospitals.slice(0, 5).map((h) => h.name) });
  const cached = getCache(key);
  if (cached) return cached;

  const symptom = await analyzeSymptoms({ symptoms, age, history });

  const recommendation = nearbyHospitals
    .slice(0, 3)
    .sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999))
    .map((h) => ({ name: h.name, reason: `Nearest with beds=${h.availableBeds} and ICU=${h.icuAvailable ? 'yes' : 'no'}` }));

  const safe = {
    summary: symptom.summary || 'Limited AI triage summary available.',
    severity: normSeverity(symptom.severity),
    probable_conditions: symptom.probable_conditions || ['Undetermined'],
    safety_note: 'AI support only. Not a medical diagnosis. Seek licensed clinician care immediately for severe symptoms.',
    hospital_recommendations: recommendation,
    next_steps: symptom.recommendation || 'Go to nearest emergency department if symptoms worsen.',
  };

  setCache(key, safe);
  return safe;
};
