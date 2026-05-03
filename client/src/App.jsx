import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SkeletonCard from './components/SkeletonCard';
import { useAuthStore } from './contexts/authStore';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard'));
const ProfilePage = lazy(() => import('./pages/patient/ProfilePage'));
const HospitalListPage = lazy(() => import('./pages/patient/HospitalListPage'));
const TelemedicinePage = lazy(() => import('./pages/patient/TelemedicinePage'));
const BookAppointmentPage = lazy(() => import('./pages/patient/BookAppointmentPage'));
const VideoConsultationPage = lazy(() => import('./pages/patient/VideoConsultationPage'));
const HospitalDashboard = lazy(() => import('./pages/hospital/HospitalDashboard'));
const DoctorDashboardPage = lazy(() => import('./pages/hospital/DoctorDashboardPage'));

const RequireRole = ({ roles, children }) => {
  const role = useAuthStore((s) => s.role);
  if (!role) return <Navigate to="/login" replace />;
  return roles.includes(role) ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <main className="mx-auto w-full max-w-7xl p-4 lg:p-8">
        <Suspense fallback={<div className="grid gap-4 md:grid-cols-2"><SkeletonCard /><SkeletonCard /></div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<RequireRole roles={['patient','doctor','admin']}><PatientDashboard /></RequireRole>} />
            <Route path="/profile" element={<RequireRole roles={['patient']}><ProfilePage /></RequireRole>} />
            <Route path="/hospitals" element={<RequireRole roles={['patient']}><HospitalListPage /></RequireRole>} />
            <Route path="/telemedicine" element={<RequireRole roles={['patient']}><TelemedicinePage /></RequireRole>} />
            <Route path="/telemedicine/book/:doctorId" element={<RequireRole roles={['patient']}><BookAppointmentPage /></RequireRole>} />
            <Route path="/telemedicine/call/:appointmentId" element={<RequireRole roles={['patient','doctor']}><VideoConsultationPage /></RequireRole>} />
            <Route path="/hospital/dashboard" element={<RequireRole roles={['admin']}><HospitalDashboard /></RequireRole>} />
            <Route path="/doctor/dashboard" element={<RequireRole roles={['doctor']}><DoctorDashboardPage /></RequireRole>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
