import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Layouts & Protected Routes
import { PublicLayout } from './layouts/PublicLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { SkillsPage } from './pages/SkillsPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { CertificatesPage } from './pages/CertificatesPage';
import { CertificateDetailsPage } from './pages/CertificateDetailsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPage } from './pages/AdminPage';

// Loading Screen
import { LoadingScreen } from './components/public/LoadingScreen';

const AppRoutes: React.FC = () => {
  const [systemLoaded, setSystemLoaded] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin') || path === '/login') {
        return true;
      }
      return sessionStorage.getItem('am_sys_loaded') === 'true';
    }
    return false;
  });

  const handleSystemLoaded = () => {
    sessionStorage.setItem('am_sys_loaded', 'true');
    setSystemLoaded(true);
  };

  if (!systemLoaded) {
    return <LoadingScreen onComplete={handleSystemLoaded} />;
  }

  return (
    <Routes>
      {/* Public Routes with Persistent Layout (Header, Footer, Floating AI, Mobile Bottom Bar) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/certificates/:slug" element={<CertificateDetailsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/:tab"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Custom Fallback Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
