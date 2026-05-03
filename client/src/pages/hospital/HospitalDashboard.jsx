import PageContainer from '../../components/PageContainer';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../../services/api';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export default function HospitalDashboard() {
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [ambulanceMap, setAmbulanceMap] = useState({});

  const fetchRequests = async () => {
    const { data } = await api.get('/emergencies');
    setRequests(data.data || data);
  };

  useEffect(() => {
    fetchRequests();

    socket.on('emergency:new', (payload) => setRequests((prev) => [payload, ...prev]));
    socket.on('emergency:updated', (payload) => setRequests((prev) => prev.map((item) => (item._id === payload._id ? payload : item))));
    socket.on('emergency_created', (payload) => setEvents((e) => [{ type: 'emergency_created', at: Date.now(), id: payload._id }, ...e].slice(0, 10)));
    socket.on('emergency_accepted', (payload) => setEvents((e) => [{ type: 'emergency_accepted', at: Date.now(), id: payload._id }, ...e].slice(0, 10)));
    socket.on('ambulance_dispatched', (payload) => setEvents((e) => [{ type: 'ambulance_dispatched', at: Date.now(), id: payload.emergencyId, status: payload.status }, ...e].slice(0, 10)));
    socket.on('ambulance_location', (payload) => setAmbulanceMap((m) => ({ ...m, [payload.emergencyId]: payload.location })));

    return () => {
      socket.off('emergency:new'); socket.off('emergency:updated'); socket.off('emergency_created');
      socket.off('emergency_accepted'); socket.off('ambulance_dispatched'); socket.off('ambulance_location');
    };
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/emergencies/${id}/status`, { status });
  };

  return (
    <PageContainer>
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="text-xl font-semibold">Incoming Emergency Requests</h2>
          <div className="mt-4 space-y-3">
            {requests.map((request) => (
              <div key={request._id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium">{request.patient?.name || 'Unknown Patient'} · {request.hospital?.name || 'Unassigned'}</p>
                <p className="text-sm text-slate-500">Severity: {request.severity} · Status: {request.status}</p>
                <p className="text-xs text-slate-400">Ambulance: {ambulanceMap[request._id] ? `${ambulanceMap[request._id].lat.toFixed(4)}, ${ambulanceMap[request._id].lng.toFixed(4)}` : 'Not dispatched'}</p>
                {request.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <button className="btn-primary" onClick={() => updateStatus(request._id, 'accepted')}>Accept</button>
                    <button className="rounded-xl border border-slate-300 px-4 py-2" onClick={() => updateStatus(request._id, 'rejected')}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <aside className="card">
          <h3 className="font-semibold">Realtime Event Stream</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-600">
            {events.map((evt, i) => <li key={`${evt.id}-${i}`}>{evt.type} · {evt.id}</li>)}
          </ul>
        </aside>
      </section>
    </PageContainer>
  );
}
