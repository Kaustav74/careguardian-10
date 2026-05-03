import PageContainer from '../../components/PageContainer';
import { useNavigate } from 'react-router-dom';

export default function HospitalLoginPage() {
  const navigate = useNavigate();
  return (
    <PageContainer>
    <section className="mx-auto max-w-md card">
      <h1 className="mb-1 text-2xl font-semibold">Hospital Admin Login</h1>
      <p className="mb-6 text-sm text-slate-500">Manage incoming emergencies securely.</p>
      <form onSubmit={(e) => { e.preventDefault(); navigate('/hospital/dashboard'); }} className="space-y-4">
        <input className="input" placeholder="Admin Email" required />
        <input className="input" type="password" placeholder="Password" required />
        <button className="btn-primary w-full">Login as Admin</button>
      </form>
    </section>
    </PageContainer>
  );
}
