import { Link } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';

const links = [
  { to: '/dashboard', label: 'Patient Dashboard' },
  { to: '/profile', label: 'Profile' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/complete-later', label: 'Complete Later' },
  { to: '/upgrade-plan', label: 'Upgrade Plan' },
  { to: '/hospital/dashboard', label: 'Hospital Admin' },
];

export default function Navbar() {
  const { user } = useAuthStore();
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="text-lg font-semibold text-slate-900">CareGuardian</Link>
          {user?.subscription === 'premium' && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">PREMIUM</span>}
        </div>
        <nav className="flex flex-wrap gap-2 text-sm text-slate-600">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
