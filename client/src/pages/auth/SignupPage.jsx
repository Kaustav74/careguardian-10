import PageContainer from '../../components/PageContainer';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <PageContainer>
    <section className="mx-auto max-w-md card">
      <h1 className="mb-1 text-2xl font-semibold">Create Account</h1>
      <p className="mb-6 text-sm text-slate-500">Start your CareGuardian journey.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="input" placeholder="Full name" required />
        <input className="input" type="email" placeholder="Email" required />
        <input className="input" type="password" placeholder="Password" required />
        <button className="btn-primary w-full">Sign Up</button>
      </form>
    </section>
    </PageContainer>
  );
}
