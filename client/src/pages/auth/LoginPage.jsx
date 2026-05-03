import PageContainer from '../../components/PageContainer';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../services/api';
import { useAuthStore } from '../../contexts/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      await setAuth(data.token);
      const nextRole = useAuthStore.getState().role;
      if (nextRole === 'doctor') navigate('/doctor/dashboard');
      else if (nextRole === 'admin') navigate('/hospital-admin');
      else navigate('/dashboard');
    } catch (_e) {
      setError('Invalid login credentials');
    } finally { setLoading(false); }
  };

  return (
    <PageContainer>
    <section className="mx-auto max-w-md card">
      <h1 className="mb-1 text-2xl font-semibold">Login</h1>
      <p className="mb-6 text-sm text-slate-500">Access emergency-ready healthcare in seconds.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="input" type="email" placeholder="Email" required value={form.email} onChange={(e)=>setForm((f)=>({...f,email:e.target.value}))} />
        <input className="input" type="password" placeholder="Password" required value={form.password} onChange={(e)=>setForm((f)=>({...f,password:e.target.value}))} />
        <button className="btn-primary w-full" disabled={loading}>{loading?'Logging in...':'Login'}</button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-sm">No account? <Link to="/signup" className="text-brand-600">Create one</Link></p>
    </section>
    </PageContainer>
  );
}
