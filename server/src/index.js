const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const aiRoutes = require('./routes/aiRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const patientRoutes = require('./routes/patientRoutes');
const hospitalOpsRoutes = require('./routes/hospitalOpsRoutes');
const telemedicineRoutes = require('./routes/telemedicineRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const ruralRoutes = require('./routes/ruralRoutes');
const { setSocketServer } = require('./controllers/emergencyController');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { initRealtime } = require('./services/realtimeService');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});
setSocketServer(io);
initRealtime(io);

app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGIN || '*').split(','), methods: ['GET','POST','PATCH','PUT','DELETE'] }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));
app.use(mongoSanitize());
app.use(hpp());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/hospital-ops', hospitalOpsRoutes);
app.use('/api/telemedicine', telemedicineRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/generated', express.static(require('path').join(__dirname, 'generated')));
app.use('/api/rural', ruralRoutes);

io.on('connection', (socket) => {
  socket.emit('connected', { ok: true, message: 'CareGuardian realtime connected' });
  socket.on('subscribe_emergency', (emergencyId) => socket.join(`emergency:${emergencyId}`));
  socket.on('join_consultation', (roomId) => socket.join(`consult:${roomId}`));
  socket.on('consult_message', (payload) => io.to(`consult:${payload.roomId}`).emit('consult_message', payload));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info({ message: `Server running on ${PORT}` }));
