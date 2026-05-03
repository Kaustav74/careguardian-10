import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import ProfilePage from './pages/patient/ProfilePage';
import HospitalListPage from './pages/patient/HospitalListPage';
import CompleteLaterPage from './pages/patient/CompleteLaterPage';
import HospitalLoginPage from './pages/hospital/HospitalLoginPage';
import HospitalDashboard from './pages/hospital/HospitalDashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/hospitals" element={<HospitalListPage />} />
          <Route path="/complete-later" element={<CompleteLaterPage />} />
          <Route path="/hospital/login" element={<HospitalLoginPage />} />
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        </Routes>
      </main>
    </div>
  );
}
