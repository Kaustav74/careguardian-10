const Hospital = require('../models/Hospital');

exports.listHospitals = async () => Hospital.find().lean();
