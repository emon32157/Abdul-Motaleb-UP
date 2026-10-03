import React from 'react';
import { useData } from '../../context/DataContext';
import { AdminTab } from './AdminLayout';
import {
  FolderGit2,
  Briefcase,
  Wrench,
  Award,
  Image as ImageIcon,
  MessageSquareQuote,
  Mail,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  Upload,
  CheckCircle,
  Clock,
  ArrowRight,
  Bot,
  Sparkles,
  BookOpen,
  Cloud
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const {
    projects,
    services,
    skills,
    certificates,
    gallery,
    testimonials,
    messages,
    siteSettings,
    updateSiteSettings,
    markMessageRead
  } = useData();

  const unreadMessages = messages.filter((m) => !m.read);

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: FolderGit2,
      tab: 'projects' as AdminTab,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30'
    },
    {
      label: 'Active Services',
      value: services.length,
      icon: Briefcase,
      tab: 'services' as AdminTab,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30'
    },
    {
      label: 'Verified Skills',
      value: skills.length,
      icon: Wrench,
      tab: 'skills' as AdminTab,
      color: 'text-blue-400',
      border: 'border-blue-500/30'
    },
    {
      label: 'Certificates',
      value: certificates.length,
      icon: Award,
      tab: 'certificates' as AdminTab,
      color: 'text-purple-400',
      border: 'border-purple-500/30'
    },
    {
      label: 'Gallery Photos',
      value: gallery.length,
      icon: ImageIcon,
      tab: 'gallery' as AdminTab,
      color: 'text-pink-400',
      border: 'border-pink-500/30'
    },
    {
      label: 'Testimonials',
      value: testimonials.length,
      icon: MessageSquareQuote,
      tab: 'testimonials' as AdminTab,
      color: 'text-amber-400',
      border: 'border-amber-500/30'
    },
    {
      label: 'Inquiry Messages',
      value: messages.length,
      subValue: `${unreadMessages.length} unread`,
      icon: Mail,
      tab: 'messages' as AdminTab,
      color: 'text-rose-400',
      border: 'border-rose-500/30'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Alert / Status */}
      <div className="p-5 rounded-2xl border border-cyan-500/30 bg-[#0a1224]/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              Cyber Security Infrastructure Online
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Firebase Firestore Connected • ImgBB Media API Ready • 52+ Photos Loaded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Maintenance Toggle */}
          <button
            onClick={() =>
              updateSiteSettings({ maintenanceMode: !siteSettings.maintenanceMode })
            }
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
              siteSettings.maintenanceMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {siteSettings.maintenanceMode ? '● Maintenance: ON' : '○ Maintenance: OFF'}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigateTab(stat.tab)}
              className={`p-4 sm:p-5 rounded-2xl border ${stat.border} bg-[#0a1224]/70 backdrop-blur-md hover:scale-[1.02] cursor-pointer transition-all duration-200 group flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {stat.value}
                </div>
                {stat.subValue && (
                  <div className="text-[11px] font-mono text-rose-400 mt-0.5">
                    {stat.subValue}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Bar */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
          Fast Command Actions
        </h4>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigateTab('ai-assistant')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono hover:from-cyan-500/30 hover:to-emerald-500/30 transition-all shadow-[0_0_10px_rgba(0,242,254,0.15)]"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>AI Assistant Settings</span>
          </button>

          <button
            onClick={() => onNavigateTab('ai-knowledge')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono hover:bg-purple-500/20 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>AI Knowledge Base</span>
          </button>

          <button
            onClick={() => onNavigateTab('projects')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/20 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Project</span>
          </button>

          <button
            onClick={() => onNavigateTab('media')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-emerald-500/20 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image (ImgBB)</span>
          </button>

          <button
            onClick={() => onNavigateTab('gallery')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono hover:bg-blue-500/20 transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Manage All 52+ Gallery Photos</span>
          </button>

          <button
            onClick={() => onNavigateTab('backup')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono hover:bg-amber-500/20 transition-colors"
          >
            <Cloud className="w-4 h-4 text-amber-400" />
            <span>Firebase Cloud Sync</span>
          </button>

          <button
            onClick={() => onNavigateTab('seo')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono hover:bg-purple-500/20 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Update SEO & Google Verification</span>
          </button>
        </div>
      </div>

      {/* Recent Contact Inquiries */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-sm text-white">Recent Client Inquiries</h4>
          </div>
          <button
            onClick={() => onNavigateTab('messages')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All ({messages.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {messages.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">No contact messages received yet.</p>
        ) : (
          <div className="space-y-2.5">
            {messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  msg.read
                    ? 'border-slate-800 bg-[#070c1a] text-slate-400'
                    : 'border-cyan-500/40 bg-[#0c162e] text-white shadow-[0_0_15px_rgba(0,242,254,0.1)]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{msg.fullName}</span>
                    <span className="text-[11px] font-mono text-cyan-400">({msg.email})</span>
                    {!msg.read && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-1">{msg.subject}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{msg.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </span>
                  {!msg.read && (
                    <button
                      onClick={() => markMessageRead(msg.id, true)}
                      className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[10px] font-mono"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
