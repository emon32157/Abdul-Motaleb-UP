import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Settings,
  Sparkles,
  User,
  Wrench,
  Briefcase,
  FolderGit2,
  Milestone,
  Award,
  Image as ImageIcon,
  HardDrive,
  BarChart3,
  MessageSquareQuote,
  Mail,
  Navigation,
  Share2,
  Search,
  Palette,
  DatabaseBackup,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Bot,
  BookOpen
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'settings'
  | 'ai-assistant'
  | 'ai-knowledge'
  | 'hero'
  | 'about'
  | 'skills'
  | 'services'
  | 'projects'
  | 'experience'
  | 'certificates'
  | 'gallery'
  | 'media'
  | 'statistics'
  | 'testimonials'
  | 'messages'
  | 'navigation'
  | 'social'
  | 'seo'
  | 'theme'
  | 'backup';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onViewSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onViewSite,
  children
}) => {
  const { logout, currentUser, isDemoAdmin } = useAuth();
  const { messages } = useData();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'messages', label: 'Messages', icon: Mail, badge: unreadMessagesCount }
      ]
    },
    {
      title: 'AI & INTELLIGENCE',
      items: [
        { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
        { id: 'ai-knowledge', label: 'AI Knowledge Base', icon: BookOpen }
      ]
    },
    {
      title: 'CONTENT SECTIONS',
      items: [
        { id: 'hero', label: 'Hero Section', icon: Sparkles },
        { id: 'about', label: 'About Me', icon: User },
        { id: 'skills', label: 'Skills & Tools', icon: Wrench },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'projects', label: 'Projects', icon: FolderGit2 },
        { id: 'experience', label: 'Experience', icon: Milestone },
        { id: 'certificates', label: 'Certificates', icon: Award },
        { id: 'gallery', label: 'Gallery (52+)', icon: ImageIcon },
        { id: 'media', label: 'Media Library', icon: HardDrive },
        { id: 'statistics', label: 'Statistics', icon: BarChart3 },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote }
      ]
    },
    {
      title: 'SYSTEM & CONFIG',
      items: [
        { id: 'settings', label: 'Site Settings', icon: Settings },
        { id: 'navigation', label: 'Navigation', icon: Navigation },
        { id: 'social', label: 'Social Links', icon: Share2 },
        { id: 'seo', label: 'SEO & Verification', icon: Search },
        { id: 'theme', label: 'Theme & Colors', icon: Palette },
        { id: 'backup', label: 'Backup & Restore', icon: DatabaseBackup }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid-bg opacity-25 pointer-events-none -z-10" />

      {/* Mobile Top Navbar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#080d1e] border-b border-cyan-500/20 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
            &lt;/&gt;
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Abdul Motaleb</h1>
            <p className="text-[10px] font-mono text-cyan-400">Admin Security Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewSite}
            className="p-1.5 rounded-lg border border-cyan-500/30 text-cyan-400 text-xs flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg border border-cyan-500/30 bg-[#0c162e] text-cyan-300"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-64 bg-[#070b18]/95 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 lg:static ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white">Admin Panel</h2>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AUTHENTICATED
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id as AdminTab);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.15)] font-semibold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {typeof item.badge === 'number' && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-cyan-500/20 bg-[#060a16] space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="truncate max-w-[130px]" title={currentUser?.email || (isDemoAdmin ? 'admin@abdulmotaleb.com' : 'Admin User')}>
                {currentUser?.email || (isDemoAdmin ? 'admin@demo' : 'Admin')}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onViewSite}
                className="flex-1 py-1.5 px-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-xs flex items-center justify-center gap-1 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Site</span>
              </button>

              <button
                onClick={() => logout()}
                className="py-1.5 px-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs flex items-center justify-center gap-1 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Workspace Topbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
              ADMIN CONTROL CENTER / {currentTab.toUpperCase()}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white capitalize mt-0.5">
              {currentTab === 'seo' ? 'SEO & Meta Management' : currentTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewSite}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-500/40 bg-[#0a1224] text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-mono font-medium transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Site</span>
            </button>
          </div>
        </div>

        {/* Content Children */}
        <div className="animate-in fade-in duration-200">
          {children}
        </div>
      </main>
    </div>
  );
};
