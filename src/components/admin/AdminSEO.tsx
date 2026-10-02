import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Save, CheckCircle, Search, ShieldCheck } from 'lucide-react';

export const AdminSEO: React.FC = () => {
  const { seo, updateSEO } = useData();
  const [formData, setFormData] = useState({ ...seo });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSEO(formData);
      showNotice('SEO and metadata configuration updated!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Verification & Core Indexing */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Google Verification & Crawler Directives</span>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">
            Google Site Verification Meta Tag Value *
          </label>
          <input
            type="text"
            required
            value={formData.googleVerification}
            onChange={(e) => setFormData({ ...formData, googleVerification: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
          />
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
            Preserved verification code: qMBAhBAM1H9LGRBS2XRXJY_ffyNEucSdZW1W_Dbf2Bw
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Robots Meta</label>
            <input
              type="text"
              value={formData.robots}
              onChange={(e) => setFormData({ ...formData, robots: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Standard SEO Tags */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <Search className="w-4 h-4" />
          <span>Standard Search Engine Metadata</span>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">Page Title (HTML &lt;title&gt;)</label>
          <input
            type="text"
            required
            value={formData.seoTitle}
            onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">Meta Description</label>
          <textarea
            rows={2}
            required
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">Canonical URL</label>
          <input
            type="text"
            value={formData.canonicalUrl}
            onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">
            SEO Keywords (Preserved English & বাংলা keywords)
          </label>
          <textarea
            rows={4}
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white leading-relaxed font-mono"
          />
        </div>
      </div>

      {/* Open Graph & Twitter Cards */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-cyan-400">
          Social Sharing Cards (Open Graph & Twitter)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Open Graph Title</label>
            <input
              type="text"
              value={formData.ogTitle}
              onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Twitter Card Title</label>
            <input
              type="text"
              value={formData.twitterTitle}
              onChange={(e) => setFormData({ ...formData, twitterTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">OG Description</label>
            <textarea
              rows={2}
              value={formData.ogDescription}
              onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Twitter Description</label>
            <textarea
              rows={2}
              value={formData.twitterDescription}
              onChange={(e) => setFormData({ ...formData, twitterDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">OG Image URL</label>
            <input
              type="text"
              value={formData.ogImage}
              onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Twitter Image URL</label>
            <input
              type="text"
              value={formData.twitterImage}
              onChange={(e) => setFormData({ ...formData, twitterImage: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save SEO & Metadata'}</span>
        </button>
      </div>
    </form>
  );
};
