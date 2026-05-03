const EventEmitter = require('events');
class CareGuardianBus extends EventEmitter {}
module.exports = new CareGuardianBus();
