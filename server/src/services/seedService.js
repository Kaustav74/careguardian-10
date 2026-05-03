const Hospital = require('../models/Hospital');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = async function seedBaseData() {
  const count = await Hospital.countDocuments();
  if (!count) {
    await Hospital.insertMany([
      { name: 'Apollo Hospital', city: 'Bengaluru', emergencyCapacity: 12, location: { lat: 12.9716, lng: 77.5946 } },
      { name: 'Fortis Memorial', city: 'Gurugram', emergencyCapacity: 9, location: { lat: 28.4595, lng: 77.0266 } },
      { name: 'AIIMS', city: 'New Delhi', emergencyCapacity: 20, location: { lat: 28.5672, lng: 77.2100 } },
    ]);
  }

  const demoUser = await User.findOne({ email: 'demo.patient@careguardian.app' });
  if (!demoUser) {
    const password = await bcrypt.hash('demo12345', 10);
    await User.create({ name: 'Demo Patient', email: 'demo.patient@careguardian.app', password, role: 'patient' });
  }
};
