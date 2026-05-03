import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SkeletonCard from './components/SkeletonCard';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard'));
const ProfilePage = lazy(() => import('./pages/patient/ProfilePage'));
const HospitalListPage = lazy(() => import('./pages/patient/HospitalListPage'));
const CompleteLaterPage = lazy(() => import('./pages/patient/CompleteLaterPage'));
const UpgradePlanPage = lazy(() => import('./pages/patient/UpgradePlanPage'));
const TelemedicinePage = lazy(() => import('./pages/patient/TelemedicinePage'));
const BookAppointmentPage = lazy(() => import('./pages/patient/BookAppointmentPage'));
const VideoConsultationPage = lazy(() => import('./pages/patient/VideoConsultationPage'));
const HospitalLoginPage = lazy(() => import('./pages/hospital/HospitalLoginPage'));
const HospitalDashboard = lazy(() => import('./pages/hospital/HospitalDashboard'));
const DoctorDashboardPage = lazy(() => import('./pages/hospital/DoctorDashboardPage'));
const RuralOutreachPage = lazy(() => import('./pages/patient/RuralOutreachPage'));

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
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/hospitals" element={<HospitalListPage />} />
            <Route path="/complete-later" element={<CompleteLaterPage />} />
            <Route path="/upgrade-plan" element={<UpgradePlanPage />} />
            <Route path="/telemedicine" element={<TelemedicinePage />} />
            <Route path="/telemedicine/book/:doctorId" element={<BookAppointmentPage />} />
            <Route path="/telemedicine/call/:appointmentId" element={<VideoConsultationPage />} />
            <Route path="/hospital/login" element={<HospitalLoginPage />} />
            <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
            <Route path="/rural-outreach" element={<RuralOutreachPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
