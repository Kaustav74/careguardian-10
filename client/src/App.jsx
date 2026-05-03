import { lazy, Suspense, useEffect, useRef } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SkeletonCard from './components/SkeletonCard';
import { useAuthStore } from './contexts/authStore';
import { ProtectedRoute, RoleProtectedRoute } from './components/ProtectedRoute';

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
const AIAssistantPage = lazy(() => import('./pages/patient/AIAssistantPage'));
const UpgradePlanPage = lazy(() => import('./pages/patient/UpgradePlanPage'));

export default function App() {
  const loadingUser = useAuthStore((s) => s.loadingUser);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    useAuthStore.getState().hydrateAuth();
  }, []);

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Restoring session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <main className="mx-auto w-full max-w-7xl p-4 lg:p-8">
        <Suspense fallback={<div className="grid gap-4 md:grid-cols-2"><SkeletonCard /><SkeletonCard /></div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/hospitals" element={<ProtectedRoute><HospitalListPage /></ProtectedRoute>} />
            <Route path="/telemedicine" element={<ProtectedRoute><TelemedicinePage /></ProtectedRoute>} />
            <Route path="/telemedicine/book/:doctorId" element={<ProtectedRoute><BookAppointmentPage /></ProtectedRoute>} />
            <Route path="/telemedicine/call/:appointmentId" element={<ProtectedRoute><VideoConsultationPage /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
            <Route path="/upgrade-plan" element={<ProtectedRoute><UpgradePlanPage /></ProtectedRoute>} />
            <Route path="/hospital-admin" element={<RoleProtectedRoute roles={['admin']}><HospitalDashboard /></RoleProtectedRoute>} />
            <Route path="/doctor/dashboard" element={<RoleProtectedRoute roles={['doctor']}><DoctorDashboardPage /></RoleProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
