import PageContainer from '../../components/PageContainer';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <PageContainer>
    <section className="mx-auto max-w-md card">
      <h1 className="mb-1 text-2xl font-semibold">Patient Login</h1>
      <p className="mb-6 text-sm text-slate-500">Access emergency-ready healthcare in seconds.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="input" type="email" placeholder="Email" required />
        <input className="input" type="password" placeholder="Password" required />
        <button className="btn-primary w-full">Login</button>
      </form>
      <p className="mt-4 text-sm">No account? <Link to="/signup" className="text-brand-600">Create one</Link></p>
    </section>
    </PageContainer>
  );
}
