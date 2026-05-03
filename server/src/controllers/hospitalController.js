const Hospital = require('../models/Hospital');

const distance = (a, b) => {
  const dx = (a?.lat || 0) - (b?.lat || 0);
  const dy = (a?.lng || 0) - (b?.lng || 0);
  return Math.sqrt(dx * dx + dy * dy) * 111;
};

exports.getHospitals = async (req, res) => {
  const { userLat, userLng, maxDistanceKm, costCategory, hasIcu, minBeds } = req.query;
  const hospitals = await Hospital.find().lean();

  const userLoc = userLat && userLng ? { lat: Number(userLat), lng: Number(userLng) } : { lat: 28.6139, lng: 77.2090 };

  const enriched = hospitals.map((h) => ({ ...h, distanceKm: Number(distance(userLoc, h.location).toFixed(1)) }));

  const filtered = enriched.filter((h) => {
    if (maxDistanceKm && h.distanceKm > Number(maxDistanceKm)) return false;
    if (costCategory && h.costCategory !== costCategory) return false;
    if (hasIcu === 'true' && !h.icuAvailable) return false;
    if (minBeds && h.availableBeds < Number(minBeds)) return false;
    return true;
  });

  filtered.sort((a, b) => a.distanceKm - b.distanceKm);
  res.json(filtered);
};
