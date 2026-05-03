const eventBus = require('../events/eventBus');

let io = null;
const ambulanceTrackers = new Map();

exports.initRealtime = (socketServer) => {
  io = socketServer;

  eventBus.on('emergency_created', (payload) => io.emit('emergency_created', payload));
  eventBus.on('emergency_accepted', (payload) => io.emit('emergency_accepted', payload));
  eventBus.on('ambulance_dispatched', (payload) => io.emit('ambulance_dispatched', payload));
  eventBus.on('ambulance_location', (payload) => io.emit('ambulance_location', payload));
};

exports.dispatchAmbulance = ({ emergencyId, start = { lat: 28.61, lng: 77.20 } }) => {
  if (ambulanceTrackers.has(emergencyId)) return;
  let step = 0;
  eventBus.emit('ambulance_dispatched', { emergencyId, status: 'enroute' });

  const timer = setInterval(() => {
    step += 1;
    const location = { lat: start.lat + step * 0.0006, lng: start.lng + step * 0.0006 };
    eventBus.emit('ambulance_location', { emergencyId, location, step });
    if (step >= 20) {
      clearInterval(timer);
      ambulanceTrackers.delete(emergencyId);
      eventBus.emit('ambulance_dispatched', { emergencyId, status: 'arrived' });
    }
  }, 1500);

  ambulanceTrackers.set(emergencyId, timer);
};
