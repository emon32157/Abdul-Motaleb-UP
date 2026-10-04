import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout, AdminTab } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminAISettings } from '../components/admin/AdminAISettings';
import { AdminAIKnowledge } from '../components/admin/AdminAIKnowledge';
import { AdminHero } from '../components/admin/AdminHero';
import { AdminAbout } from '../components/admin/AdminAbout';
import { AdminSkills } from '../components/admin/AdminSkills';
import { AdminServices } from '../components/admin/AdminServices';
import { AdminProjects } from '../components/admin/AdminProjects';
import { AdminExperience } from '../components/admin/AdminExperience';
import { AdminCertificates } from '../components/admin/AdminCertificates';
import { AdminGallery } from '../components/admin/AdminGallery';
import { AdminMedia } from '../components/admin/AdminMedia';
import { AdminStats } from '../components/admin/AdminStats';
import { AdminTestimonials } from '../components/admin/AdminTestimonials';
import { AdminMessages } from '../components/admin/AdminMessages';
import { AdminNavigation } from '../components/admin/AdminNavigation';
import { AdminSocial } from '../components/admin/AdminSocial';
import { AdminSEO } from '../components/admin/AdminSEO';
import { AdminTheme } from '../components/admin/AdminTheme';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminBackup } from '../components/admin/AdminBackup';
import { SEOHead } from '../components/seo/SEOHead';

export const AdminPage: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  // Normalize URL segment to AdminTab
  let currentTab: AdminTab = 'dashboard';
  if (tab) {
    if (tab === 'ai') {
      currentTab = 'ai-assistant';
    } else if (tab === 'stats') {
      currentTab = 'statistics';
    } else {
      currentTab = tab as AdminTab;
    }
  }

  const handleTabChange = (newTab: AdminTab) => {
    const routeSegment = newTab === 'ai-assistant' ? 'ai' : newTab;
    navigate(`/admin/${routeSegment}`);
  };

  const handleViewSite = () => {
    navigate('/');
  };

  return (
    <>
      <SEOHead
        title={`Admin Hub • ${currentTab.toUpperCase()}`}
        description="Protected Admin Dashboard and Content Management System"
        canonicalUrl={`/admin/${tab || 'dashboard'}`}
      />

      <AdminLayout
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onViewSite={handleViewSite}
      >
        {currentTab === 'dashboard' && (
          <AdminDashboard onNavigateTab={handleTabChange} />
        )}
        {currentTab === 'ai-assistant' && <AdminAISettings />}
        {currentTab === 'ai-knowledge' && <AdminAIKnowledge />}
        {currentTab === 'hero' && <AdminHero />}
        {currentTab === 'about' && <AdminAbout />}
        {currentTab === 'skills' && <AdminSkills />}
        {currentTab === 'services' && <AdminServices />}
        {currentTab === 'projects' && <AdminProjects />}
        {currentTab === 'experience' && <AdminExperience />}
        {currentTab === 'certificates' && <AdminCertificates />}
        {currentTab === 'gallery' && <AdminGallery />}
        {currentTab === 'media' && <AdminMedia />}
        {currentTab === 'statistics' && <AdminStats />}
        {currentTab === 'testimonials' && <AdminTestimonials />}
        {currentTab === 'messages' && <AdminMessages />}
        {currentTab === 'navigation' && <AdminNavigation />}
        {currentTab === 'social' && <AdminSocial />}
        {currentTab === 'seo' && <AdminSEO />}
        {currentTab === 'theme' && <AdminTheme />}
        {currentTab === 'settings' && <AdminSettings />}
        {currentTab === 'backup' && <AdminBackup />}
      </AdminLayout>
    </>
  );
};
