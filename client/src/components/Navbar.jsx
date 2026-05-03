import { Link } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Patient Dashboard' },
  { to: '/profile', label: 'Profile' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/hospital/dashboard', label: 'Hospital Admin' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/dashboard" className="text-lg font-semibold text-slate-900">CareGuardian</Link>
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
