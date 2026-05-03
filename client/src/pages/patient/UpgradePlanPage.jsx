import { useState } from 'react';
import { api } from '../../services/api';
import { useAuthStore } from '../../contexts/authStore';

export default function UpgradePlanPage() {
  const { user, setSubscription } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const upgrade = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        await api.patch('/patients/subscription', { userId: user.id, plan: 'premium' });
      }
      setSubscription('premium');
      setMessage('Upgraded to Premium. Priority emergency and Hospital on Wheels enabled.');
    } catch {
      setMessage('Could not upgrade now. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl card">
      <h2 className="text-2xl font-semibold">Upgrade Plan</h2>
      <p className="mt-2 text-slate-600">Premium includes priority emergency handling and Hospital on Wheels access.</p>
      <div className="mt-5 rounded-2xl border border-slate-200 p-4">
        <p className="font-medium">Current Plan: <span className="uppercase">{user?.subscription || 'free'}</span></p>
        <button disabled={loading || user?.subscription === 'premium'} onClick={upgrade} className="btn-primary mt-4 disabled:opacity-60">
          {user?.subscription === 'premium' ? 'Already Premium' : loading ? 'Upgrading...' : 'Upgrade to Premium'}
        </button>
      </div>
      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </section>
  );
}
