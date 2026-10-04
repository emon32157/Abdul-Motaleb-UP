import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/public/Header';
import { Footer } from '../components/public/Footer';
import { CyberCursor } from '../components/public/CyberCursor';
import { MobileBottomBar } from '../components/public/MobileBottomBar';
import { AIChatbot } from '../components/public/AIChatbot';
import { MaintenanceScreen } from '../components/public/MaintenanceScreen';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { siteSettings } = useData();
  const { isAdmin } = useAuth();

  // Scroll to top on route change if no anchor hash
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // If maintenance mode is active and user is not admin, show maintenance screen
  if (siteSettings.maintenanceMode && !isAdmin) {
    return <MaintenanceScreen onAdminLoginClick={() => navigate('/login')} />;
  }

  return (
    <div className="relative min-h-screen bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <CyberCursor />

      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid-bg opacity-35 pointer-events-none -z-10" />

      {/* Main Top Header */}
      <Header />

      {/* Main Outlet for public pages */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer onAdminLoginClick={() => navigate('/login')} />

      {/* Floating AI Assistant Chatbot */}
      <AIChatbot />

      {/* Mobile App Bottom Bar */}
      <MobileBottomBar />
    </div>
  );
};
