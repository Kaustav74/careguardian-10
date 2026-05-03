import PageContainer from '../../components/PageContainer';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function RuralOutreachPage() {
  const [camps, setCamps] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [form, setForm] = useState({ village: '', symptoms: '', ngoPartner: '' });
  const [msg, setMsg] = useState('');

  const load = async () => {
    const [c, n] = await Promise.all([api.get('/rural/camps'), api.get('/rural/ngos')]);
    setCamps(c.data); setNgos(n.data);
  };

  useEffect(() => { load(); }, []);

  const book = async (e) => {
    e.preventDefault();
    await api.post('/rural/wheels/book', form);
    setMsg('Hospital on Wheels booking submitted.');
    setForm({ village: '', symptoms: '', ngoPartner: '' });
  };

  return (
    <PageContainer>
      <section className="space-y-4">
        <div className="card">
          <h2 className="text-xl font-semibold">Rural Outreach Dashboard</h2>
          <p className="text-sm text-slate-500">Low-bandwidth mode: text-first outreach actions.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card">
            <h3 className="font-semibold">Hospital on Wheels Booking</h3>
            <form className="mt-3 space-y-2" onSubmit={book}>
              <input className="input" placeholder="Village" value={form.village} onChange={(e)=>setForm({...form, village:e.target.value})} required />
              <textarea className="input min-h-20" placeholder="Symptoms" value={form.symptoms} onChange={(e)=>setForm({...form, symptoms:e.target.value})} required />
              <select className="input" value={form.ngoPartner} onChange={(e)=>setForm({...form, ngoPartner:e.target.value})}><option value="">NGO Partner (optional)</option>{ngos.map((n)=><option key={n.name} value={n.name}>{n.name}</option>)}</select>
              <button className="btn-primary">Book Mobile Unit</button>
            </form>
            {msg && <p className="mt-2 text-sm text-slate-600">{msg}</p>}
          </div>

          <div className="card">
            <h3 className="font-semibold">Monthly Free Camps</h3>
            <div className="mt-2 space-y-2 text-sm">
              {camps.map((c)=><div key={c._id} className="rounded-lg border p-2"><p className="font-medium">{c.title}</p><p>{c.village} · {new Date(c.date).toLocaleDateString()} · NGO: {c.ngoPartner}</p><p className="text-xs text-slate-500">Services: {c.services.join(', ')}</p></div>)}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold">NGO Integration Directory</h3>
          <ul className="mt-2 space-y-1 text-sm">{ngos.map((n)=><li key={n.name}>{n.name} · {n.focus} · {n.contact}</li>)}</ul>
        </div>
      </section>
    </PageContainer>
  );
}
