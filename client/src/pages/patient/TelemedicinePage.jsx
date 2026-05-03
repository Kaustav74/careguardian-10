import PageContainer from '../../components/PageContainer';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export default function TelemedicinePage() {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({ specialization: '', available: '', minRating: '' });

  const load = async () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    const { data } = await api.get(`/telemedicine/doctors?${params.toString()}`);
    setDoctors(data);
  };

  useEffect(() => { load(); }, []);

  return (
    <PageContainer>
      <section className="space-y-4">
        <div className="card grid gap-3 md:grid-cols-4">
          <input className="input" placeholder="Specialization" onChange={(e) => setFilters((f) => ({ ...f, specialization: e.target.value }))} />
          <select className="input" onChange={(e) => setFilters((f) => ({ ...f, available: e.target.value }))}><option value="">Availability</option><option value="true">Available</option><option value="false">Unavailable</option></select>
          <input className="input" placeholder="Min rating" type="number" step="0.1" onChange={(e) => setFilters((f) => ({ ...f, minRating: e.target.value }))} />
          <button className="btn-primary" onClick={load}>Apply</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {doctors.map((d) => <article key={d._id} className="card"><h3 className="font-semibold">Dr. {d.name}</h3><p className="text-sm text-slate-500">{d.specialization} · ⭐ {d.rating}</p><p className="mt-1 text-xs">{d.available ? 'Available' : 'Unavailable'}</p><Link to={`/telemedicine/book/${d._id}`} className="mt-3 inline-block text-sm text-brand-600">Book Appointment</Link></article>)}
        </div>
      </section>
    </PageContainer>
  );
}
