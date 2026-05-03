import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../contexts/authStore';

const guestLinks = [['Login', '/login'], ['Register', '/signup']];
const patientLinks = [['Dashboard','/dashboard'],['Profile','/profile'],['Hospitals','/hospitals'],['Telemedicine','/telemedicine'],['AI Assistant','/ai-assistant'],['Upgrade','/upgrade-plan']];
const doctorLinks = [['Doctor Dashboard','/doctor/dashboard']];
const adminLinks = [['Hospital Admin','/hospital-admin']];

export default function Sidebar() {
  const navigate = useNavigate();
  const { role, isAuthenticated, logout } = useAuthStore((s) => ({ role: s.role, isAuthenticated: s.isAuthenticated, logout: s.logout }));
  const links = !isAuthenticated ? guestLinks : role === 'doctor' ? doctorLinks : role === 'admin' ? adminLinks : patientLinks;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/40 bg-white/70 p-5 backdrop-blur-xl lg:block">
      <p className="mb-8 text-lg font-semibold tracking-tight text-slate-900">CareGuardian</p>
      <nav className="space-y-1">
        {links.map(([label, to]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `block rounded-xl px-4 py-2.5 text-sm font-medium transition ${isActive ? 'bg-slate-900 text-white shadow-soft' : 'text-slate-600 hover:bg-slate-100'}`}>
            {label}
          </NavLink>
        ))}
      </nav>
      {isAuthenticated && <button className="mt-6 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm" onClick={() => { logout(); navigate('/login'); }}>Logout</button>}
    </aside>
  );
}
