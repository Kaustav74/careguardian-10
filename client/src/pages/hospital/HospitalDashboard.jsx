import PageContainer from '../../components/PageContainer';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../../services/api';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export default function HospitalDashboard() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const { data } = await api.get('/emergencies');
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();

    socket.on('emergency:new', (payload) => {
      setRequests((prev) => [payload, ...prev]);
    });

    socket.on('emergency:updated', (payload) => {
      setRequests((prev) => prev.map((item) => (item._id === payload._id ? payload : item)));
    });

    return () => {
      socket.off('emergency:new');
      socket.off('emergency:updated');
    };
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/emergencies/${id}/status`, { status });
  };

  return (
    <PageContainer>
    <section className="card">
      <h2 className="text-xl font-semibold">Incoming Emergency Requests</h2>
      <div className="mt-4 space-y-3">
        {requests.map((request) => (
          <div key={request._id} className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium">{request.patient?.name || 'Unknown Patient'} · {request.hospital?.name || 'Unassigned'}</p>
            <p className="text-sm text-slate-500">Severity: {request.severity} · Status: {request.status}</p>
            <p className="text-xs text-slate-400">Location: {request.location?.lat?.toFixed?.(4)}, {request.location?.lng?.toFixed?.(4)}</p>
            {request.status === 'pending' && (
              <div className="mt-3 flex gap-2">
                <button className="btn-primary" onClick={() => updateStatus(request._id, 'accepted')}>Accept</button>
                <button className="rounded-xl border border-slate-300 px-4 py-2" onClick={() => updateStatus(request._id, 'rejected')}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
    </PageContainer>
  );
}
