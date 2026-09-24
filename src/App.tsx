import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Admissions from './pages/Admissions';
import Seerat from './pages/Seerat';
import GalleryPage from './pages/GalleryPage';
import Donations from './pages/Donations';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import AdmissionsManagement from './pages/Admin/AdmissionsManagement';
import ParticipantsManagement from './pages/Admin/ParticipantsManagement';
import GalleryManagement from './pages/Admin/GalleryManagement';
import DonationSettings from './pages/Admin/DonationSettings';
import SiteSettings from './pages/Admin/SiteSettings';
import SetupGuide from './pages/Admin/SetupGuide';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Layout and Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/seerat" element={<Seerat />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/donations" element={<Donations />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admissions" element={<AdmissionsManagement />} />
              <Route path="participants" element={<ParticipantsManagement />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="donations" element={<DonationSettings />} />
              <Route path="site-settings" element={<SiteSettings />} />
              <Route path="setup-guide" element={<SetupGuide />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}
