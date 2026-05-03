import PageContainer from '../../components/PageContainer';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function DoctorDashboardPage() {
  const [doctorId, setDoctorId] = useState('');
  const [data, setData] = useState(null);

  const load = async () => {
    if (!doctorId) return;
    const { data } = await api.get(`/doctors/${doctorId}/dashboard`);
    setData(data);
  };

  const toggleAvailability = async () => {
    await api.patch(`/doctors/${doctorId}/availability`, { available: !data.doctor.available, slots: data.doctor.slots });
    load();
  };

  const complete = async (id) => {
    await api.post(`/doctors/appointments/${id}/complete`, { medicines: 'Paracetamol 500mg', advice: 'Hydration and rest', summaryInput: 'Follow-up for fever' });
    load();
  };

  return <PageContainer><section className="space-y-4"><div className="card flex gap-2"><input className="input" placeholder="Doctor ID" value={doctorId} onChange={(e)=>setDoctorId(e.target.value)} /><button className="btn-primary" onClick={load}>Load Dashboard</button></div>{data && <><div className="grid gap-4 md:grid-cols-3"><div className="card"><p className="text-sm text-slate-500">Doctor</p><p className="font-semibold">Dr. {data.doctor.name}</p><p className="text-xs">{data.doctor.available?'Available':'Unavailable'}</p><button className="btn-primary mt-2" onClick={toggleAvailability}>Toggle Availability</button></div><div className="card"><p className="text-sm text-slate-500">Earnings</p><p className="text-2xl font-semibold">₹{data.earnings}</p></div><div className="card"><p className="text-sm text-slate-500">Appointments</p><p className="text-2xl font-semibold">{data.appointments.length}</p></div></div><div className="card"><h3 className="font-semibold">Manage Appointments</h3>{data.appointments.map((a)=><div key={a._id} className="mt-2 rounded-lg border p-3"><p>{a.patient?.name} · {a.slot} · {a.status}</p><p className="text-xs">Payment: {a.paymentStatus} · ₹{a.amount}</p>{a.status==='scheduled'&&<button className="btn-primary mt-2" onClick={()=>complete(a._id)}>Complete + Generate Rx</button>}{a.prescriptionUrl&&<a className="text-sm text-brand-600 block mt-1" href={`${import.meta.env.VITE_API_URL?.replace('/api','')||'http://localhost:5000'}${a.prescriptionUrl}`} target="_blank">View Prescription PDF</a>}</div>)}</div></>}</section></PageContainer>;
}
