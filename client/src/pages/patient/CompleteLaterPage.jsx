import { useState } from 'react';
import { api } from '../../services/api';

export default function CompleteLaterPage() {
  const [form, setForm] = useState({ temporaryId: '', name: '', email: '', password: '', bloodGroup: '', allergies: '', conditions: '', consentAccepted: false });
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/patients/temporary/${form.temporaryId}/upgrade`, form);
      setMessage('Registration completed successfully.');
    } catch {
      setMessage('Failed to complete registration. Check details and consent.');
    }
  };

  return (
    <section className="mx-auto max-w-2xl card">
      <h2 className="mb-4 text-xl font-semibold">Complete Registration After Stabilization</h2>
      <form className="grid gap-3 md:grid-cols-2" onSubmit={submit}>
        <input className="input md:col-span-2" placeholder="Temporary Patient ID" value={form.temporaryId} onChange={(e) => setForm({ ...form, temporaryId: e.target.value })} required />
        <input className="input" placeholder="Full Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Blood Group" onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} />
        <input className="input md:col-span-2" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input md:col-span-2" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <input className="input md:col-span-2" placeholder="Allergies" onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
        <input className="input md:col-span-2" placeholder="Current Conditions" onChange={(e) => setForm({ ...form, conditions: e.target.value })} />
        <label className="md:col-span-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.consentAccepted} onChange={(e) => setForm({ ...form, consentAccepted: e.target.checked })} /> I accept treatment consent and terms.</label>
        <button className="btn-primary md:col-span-2">Complete Registration</button>
      </form>
      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </section>
  );
}
