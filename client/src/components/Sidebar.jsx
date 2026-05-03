import { NavLink } from 'react-router-dom';

const links = [
  ['Dashboard', '/dashboard'],
  ['Profile', '/profile'],
  ['Hospitals', '/hospitals'],
  ['Upgrade', '/upgrade-plan'],
  ['Telemedicine', '/telemedicine'],
  ['Complete Later', '/complete-later'],
  ['Hospital Admin', '/hospital/dashboard'],
  ['Doctor Dashboard', '/doctor/dashboard'],
  ['Rural Outreach', '/rural-outreach'],
];

export default function Sidebar() {
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
    </aside>
  );
}
