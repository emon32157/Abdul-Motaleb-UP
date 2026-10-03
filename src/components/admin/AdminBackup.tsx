import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Cloud,
  Flame,
  RefreshCw
} from 'lucide-react';

export const AdminBackup: React.FC = () => {
  const {
    exportWebsiteData,
    importWebsiteData,
    resetToDefault,
    syncAllDataToFirebase,
    isSyncingToFirebase,
    dbConnected
  } = useData();

  const [importJson, setImportJson] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSyncToFirebase = async () => {
    setStatusMessage(null);
    const res = await syncAllDataToFirebase();
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleExport = () => {
    const dataStr = exportWebsiteData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `abdul-motaleb-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage({ type: 'success', text: 'Website backup downloaded successfully!' });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJson(content);
      }
    };
    reader.readAsText(file);
  };

  const handleProcessImport = async () => {
    if (!importJson.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste or upload JSON content first.' });
      return;
    }

    if (!confirm('Are you sure you want to import this data? Existing website content will be updated and synced to Firebase.')) {
      return;
    }

    const res = await importWebsiteData(importJson);
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      setImportJson('');
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the portfolio to default state? This will restore all 52 original gallery photos, skills, and projects and sync to Firebase.')) {
      resetToDefault();
      setStatusMessage({ type: 'success', text: 'Portfolio restored to default initial state and synced with Firebase.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Firebase Cloud Sync Section */}
      <div className="p-6 rounded-2xl border border-cyan-500/30 bg-[#091124]/90 backdrop-blur-md space-y-4 shadow-[0_0_30px_rgba(0,242,254,0.1)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-cyan-300 font-mono text-xs uppercase tracking-wider font-bold">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Firebase Firestore Cloud Sync (ফায়ারবেস ক্লাউড সিঙ্ক)</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
            dbConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            {dbConnected ? '● FIRESTORE CONNECTED' : '○ LOCAL CACHE ACTIVE'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          ওয়েবসাইটের সকল ডাটা (Hero, About, Skills, Services, Projects, Experience, Certificates, Gallery, Media, Stats, Testimonials, Navigation, Social Links, SEO, AI Chatbot Settings & Knowledge Base) ইমেজ ফাইল ছাড়া সরাসরি Firebase Firestore-এ ক্লাউডে সেভ হয়। ছবিগুলো সরাসরি ইমেজ হোস্টিং বা ImgBB ইউআরএল আকারে সুরক্ষিত থাকে।
        </p>

        <div className="pt-1">
          <button
            onClick={handleSyncToFirebase}
            disabled={isSyncingToFirebase}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-black font-bold text-xs hover:opacity-90 shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingToFirebase ? 'animate-spin' : ''}`} />
            <span>{isSyncingToFirebase ? 'Syncing all data to Firebase...' : 'Save All Website Data to Firebase (সকল ডাটা ক্লাউডে সেভ করুন)'}</span>
          </button>
        </div>
      </div>

      {/* Export Section */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <Download className="w-4 h-4" />
          <span>Export Complete Website Data</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Download a complete snapshot of all content: Hero, About, Skills, Services, Projects, Experience, Certificates, Gallery (52+ photos), Testimonials, Navigation, Social links, SEO, and AI Chatbot data as a standalone JSON backup.
        </p>

        <div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-cyan-500/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (JSON)</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <Upload className="w-4 h-4" />
          <span>Import Website Data</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Restore website configuration from a previously exported backup file. Data is validated and automatically synced to Firebase Firestore.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#060b18] border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/10 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Select Backup File (.json)</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>

          <textarea
            rows={4}
            placeholder="Or paste JSON backup content here..."
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400"
          />

          <button
            onClick={handleProcessImport}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Validate, Restore & Sync to Firebase</span>
          </button>
        </div>
      </div>

      {/* Factory Reset */}
      <div className="p-6 rounded-2xl border border-rose-500/30 bg-[#0a1224]/80 backdrop-blur-md space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <RotateCcw className="w-4 h-4" />
          <span>Factory Reset System</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Restore all sections and content to original default configuration with all 52 gallery photos, default skills, services, projects, and sync with Firebase.
        </p>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs font-mono hover:bg-rose-500/20 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Factory Defaults</span>
        </button>
      </div>
    </div>
  );
};
