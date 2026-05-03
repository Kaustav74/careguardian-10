import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import ProfilePage from './pages/patient/ProfilePage';
import HospitalListPage from './pages/patient/HospitalListPage';
import CompleteLaterPage from './pages/patient/CompleteLaterPage';
import UpgradePlanPage from './pages/patient/UpgradePlanPage';
import HospitalLoginPage from './pages/hospital/HospitalLoginPage';
import HospitalDashboard from './pages/hospital/HospitalDashboard';

export default function App() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <main className="mx-auto w-full max-w-7xl p-4 lg:p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/hospitals" element={<HospitalListPage />} />
          <Route path="/complete-later" element={<CompleteLaterPage />} />
          <Route path="/upgrade-plan" element={<UpgradePlanPage />} />
          <Route path="/hospital/login" element={<HospitalLoginPage />} />
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        </Routes>
      </main>
    </div>
  );
}
