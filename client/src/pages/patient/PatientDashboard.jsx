import PageContainer from '../../components/PageContainer';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import AIAssistantPanel from '../../components/AIAssistantPanel';

export default function PatientDashboard() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tempId, setTempId] = useState('');

  const getLocation = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) return resolve({ lat: 28.6139, lng: 77.2090 });
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 28.6139, lng: 77.2090 }),
        { timeout: 5000 }
      );
    });

  const handleSOS = async () => {
    setLoading(true);
    setMessage('');
    try {
      const location = await getLocation();
      const { data } = await api.post('/emergencies', { location, severity: 'high' });
      if (data.temporaryPatientId) setTempId(data.temporaryPatientId);
      setMessage(`Emergency created and assigned to ${data.hospital?.name || 'nearest hospital'}.`);
    } catch (error) {
      setMessage('Failed to send SOS. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
    <section className="grid gap-4 md:grid-cols-3">
      <div className="card md:col-span-2">
        <h2 className="text-xl font-semibold">Emergency SOS</h2>
        <p className="mt-2 text-slate-500">Trigger immediate emergency coordination.</p>
        <button onClick={handleSOS} disabled={loading} className="mt-6 w-full rounded-2xl bg-red-500 px-6 py-4 text-lg font-semibold text-white shadow-soft hover:bg-red-600 disabled:opacity-60">
          {loading ? 'Sending SOS...' : 'SOS - Request Immediate Help'}
        </button>
        {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
        {tempId && <p className="mt-2 text-xs text-slate-500">Temporary patient ID: {tempId}</p>}
        <Link to="/complete-later" className="mt-3 inline-block text-sm text-brand-600">Complete Registration Later</Link>
      </div>
      <AIAssistantPanel />
      <div className="card">
        <h3 className="font-semibold">Health Snapshot</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Blood Group: O+</li>
          <li>Allergies: Penicillin</li>
          <li>Emergency Contact: +91 98xxxxxx12</li>
        </ul>
      </div>
    </section>
    </PageContainer>
  );
}
