import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Public Components
import { LoadingScreen } from './components/public/LoadingScreen';
import { CyberCursor } from './components/public/CyberCursor';
import { Header } from './components/public/Header';
import { Hero } from './components/public/Hero';
import { About } from './components/public/About';
import { Skills } from './components/public/Skills';
import { Services } from './components/public/Services';
import { Projects } from './components/public/Projects';
import { Experience } from './components/public/Experience';
import { Certificates } from './components/public/Certificates';
import { Gallery } from './components/public/Gallery';
import { Stats } from './components/public/Stats';
import { Testimonials } from './components/public/Testimonials';
import { Contact } from './components/public/Contact';
import { ExtraFeaturesCard } from './components/public/ExtraFeaturesCard';
import { Footer } from './components/public/Footer';
import { MobileBottomBar } from './components/public/MobileBottomBar';
import { MaintenanceScreen } from './components/public/MaintenanceScreen';
import { AIChatbot } from './components/public/AIChatbot';

// Admin Components
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAISettings } from './components/admin/AdminAISettings';
import { AdminAIKnowledge } from './components/admin/AdminAIKnowledge';
import { AdminHero } from './components/admin/AdminHero';
import { AdminAbout } from './components/admin/AdminAbout';
import { AdminSkills } from './components/admin/AdminSkills';
import { AdminServices } from './components/admin/AdminServices';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminExperience } from './components/admin/AdminExperience';
import { AdminCertificates } from './components/admin/AdminCertificates';
import { AdminGallery } from './components/admin/AdminGallery';
import { AdminMedia } from './components/admin/AdminMedia';
import { AdminStats } from './components/admin/AdminStats';
import { AdminTestimonials } from './components/admin/AdminTestimonials';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminNavigation } from './components/admin/AdminNavigation';
import { AdminSocial } from './components/admin/AdminSocial';
import { AdminSEO } from './components/admin/AdminSEO';
import { AdminTheme } from './components/admin/AdminTheme';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminBackup } from './components/admin/AdminBackup';

const AppContent: React.FC = () => {
  const { siteSettings } = useData();
  const { isAdmin, loading: authLoading } = useAuth();
  const [systemLoaded, setSystemLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<'public' | 'admin-login' | 'admin-panel'>('public');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Handle URL path / hash detection for admin routes
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.startsWith('/admin/login') || hash === '#admin/login') {
        setCurrentView('admin-login');
      } else if (path.startsWith('/admin') || hash.startsWith('#admin')) {
        if (isAdmin) {
          setCurrentView('admin-panel');
          const rawSegment = path.replace('/admin/', '').replace('#admin/', '');
          if (rawSegment && rawSegment !== 'admin') {
            setAdminTab(rawSegment as AdminTab);
          }
        } else {
          setCurrentView('admin-login');
        }
      } else {
        setCurrentView('public');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, [isAdmin]);

  // Navigate helper
  const navigateTo = (view: 'public' | 'admin-login' | 'admin-panel', tab?: AdminTab) => {
    setCurrentView(view);
    if (tab) setAdminTab(tab);
    if (view === 'public') {
      window.history.pushState({}, '', '/');
    } else if (view === 'admin-login') {
      window.history.pushState({}, '', '/admin/login');
    } else if (view === 'admin-panel') {
      window.history.pushState({}, '', `/admin/${tab || 'dashboard'}`);
    }
  };

  // If initial loading screen hasn't finished
  if (!systemLoaded) {
    return <LoadingScreen onComplete={() => setSystemLoaded(true)} />;
  }

  // Admin Login View
  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onSuccess={() => navigateTo('admin-panel', 'dashboard')}
        onBackToSite={() => navigateTo('public')}
      />
    );
  }

  // Admin Dashboard / Management View
  if (currentView === 'admin-panel') {
    if (!isAdmin) {
      return (
        <AdminLogin
          onSuccess={() => navigateTo('admin-panel', 'dashboard')}
          onBackToSite={() => navigateTo('public')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={(tab) => {
          setAdminTab(tab);
          window.history.pushState({}, '', `/admin/${tab}`);
        }}
        onViewSite={() => navigateTo('public')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard onNavigateTab={(t) => setAdminTab(t)} />
        )}
        {adminTab === 'ai-assistant' && <AdminAISettings />}
        {adminTab === 'ai-knowledge' && <AdminAIKnowledge />}
        {adminTab === 'hero' && <AdminHero />}
        {adminTab === 'about' && <AdminAbout />}
        {adminTab === 'skills' && <AdminSkills />}
        {adminTab === 'services' && <AdminServices />}
        {adminTab === 'projects' && <AdminProjects />}
        {adminTab === 'experience' && <AdminExperience />}
        {adminTab === 'certificates' && <AdminCertificates />}
        {adminTab === 'gallery' && <AdminGallery />}
        {adminTab === 'media' && <AdminMedia />}
        {adminTab === 'statistics' && <AdminStats />}
        {adminTab === 'testimonials' && <AdminTestimonials />}
        {adminTab === 'messages' && <AdminMessages />}
        {adminTab === 'navigation' && <AdminNavigation />}
        {adminTab === 'social' && <AdminSocial />}
        {adminTab === 'seo' && <AdminSEO />}
        {adminTab === 'theme' && <AdminTheme />}
        {adminTab === 'settings' && <AdminSettings />}
        {adminTab === 'backup' && <AdminBackup />}
      </AdminLayout>
    );
  }

  // Maintenance Mode (non-admins see maintenance screen)
  if (siteSettings.maintenanceMode && !isAdmin) {
    return <MaintenanceScreen onAdminLoginClick={() => navigateTo('admin-login')} />;
  }

  // Main Public Portfolio View
  return (
    <div className="relative min-h-screen bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <CyberCursor />
      
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid-bg opacity-35 pointer-events-none -z-10" />

      {/* Main Top Header */}
      <Header />

      {/* Page Sections */}
      <main className="space-y-12 sm:space-y-16">
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Experience />
        <Certificates />
        <Gallery />

        {/* Bottom Section: Stats, Testimonials, Extra Features, Contact */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <Stats />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <Testimonials />
            </div>
            <div className="lg:col-span-5">
              <ExtraFeaturesCard />
            </div>
          </div>

          <Contact />
        </div>
      </main>

      {/* Footer */}
      <Footer onAdminLoginClick={() => navigateTo('admin-login')} />

      {/* Floating AI Assistant Chatbot */}
      <AIChatbot />

      {/* Mobile App Bottom Bar */}
      <MobileBottomBar />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
