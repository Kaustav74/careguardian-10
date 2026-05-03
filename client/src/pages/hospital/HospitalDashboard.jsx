import PageContainer from '../../components/PageContainer';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export default function HospitalDashboard() {
  const [requests, setRequests] = useState([]);
  const [analytics, setAnalytics] = useState({ dailyInflow: [], bedUtilization: [], emergencyResponseTime: 0 });
  const [queues, setQueues] = useState([]);

  const fetchAll = async () => {
    const [e, a, q] = await Promise.all([api.get('/emergencies'), api.get('/hospital-ops/analytics'), api.get('/hospital-ops/queues')]);
    setRequests(e.data.data || e.data);
    setAnalytics(a.data);
    setQueues(q.data);
  };

  useEffect(() => {
    fetchAll();
    socket.on('emergency_created', fetchAll);
    socket.on('emergency_accepted', fetchAll);
    return () => {
      socket.off('emergency_created', fetchAll);
      socket.off('emergency_accepted', fetchAll);
    };
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/emergencies/${id}/status`, { status });
  };

  return (
    <PageContainer>
      <section className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card"><p className="text-sm text-slate-500">Today Inflow</p><p className="text-2xl font-semibold">{analytics.dailyInflow.at(-1)?.count || 0}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Avg Response</p><p className="text-2xl font-semibold">{analytics.emergencyResponseTime.toFixed(1)} min</p></div>
          <div className="card"><p className="text-sm text-slate-500">Dept Queues</p><p className="text-2xl font-semibold">{queues.reduce((a, b) => a + b.count, 0)}</p></div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card h-64"><h3 className="mb-2 font-semibold">Daily Patient Inflow</h3><ResponsiveContainer width="100%" height="90%"><LineChart data={analytics.dailyInflow}><XAxis dataKey="date" hide /><YAxis /><Tooltip /><Line type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
          <div className="card h-64"><h3 className="mb-2 font-semibold">Bed Utilization %</h3><ResponsiveContainer width="100%" height="90%"><BarChart data={analytics.bedUtilization}><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Bar dataKey="utilization" fill="#2563eb" /></BarChart></ResponsiveContainer></div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold">Department-level Emergency Queue</h2>
          <div className="mt-3 flex flex-wrap gap-2">{queues.map((q) => <span key={q.department} className="rounded-lg bg-slate-100 px-3 py-1 text-sm">{q.department}: {q.count}</span>)}</div>
          <div className="mt-4 space-y-3">
            {requests.map((request) => (
              <div key={request._id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium">{request.patient?.name || 'Unknown'} · {request.department}</p>
                <p className="text-sm text-slate-500">Severity: {request.severity} · Priority: {request.priority} · Status: {request.status}</p>
                {request.status === 'pending' && <div className="mt-2 flex gap-2"><button className="btn-primary" onClick={() => updateStatus(request._id, 'accepted')}>Accept</button><button className="rounded-xl border border-slate-300 px-4 py-2" onClick={() => updateStatus(request._id, 'rejected')}>Reject</button></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
