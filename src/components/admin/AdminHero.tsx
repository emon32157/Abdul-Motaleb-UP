import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { uploadToImgBB } from '../../services/imgbb';
import { Save, Upload, CheckCircle, RefreshCw } from 'lucide-react';

export const AdminHero: React.FC = () => {
  const { hero, updateHero } = useData();
  const [formData, setFormData] = useState({ ...hero });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateHero(formData);
      setSuccessMsg('Hero section updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
      // error handled in context
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadToImgBB(file, 'hero-profile');
      setFormData((prev) => ({ ...prev, profileImageUrl: res.url }));
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert('ImgBB Upload Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Info */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-cyan-400">
          Hero Headlines & Titles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Status Badge Text (EN)</label>
            <input
              type="text"
              value={formData.badgeText}
              onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Status Badge Text (বাংলা)</label>
            <input
              type="text"
              value={formData.badgeTextBn}
              onChange={(e) => setFormData({ ...formData, badgeTextBn: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Greeting Text</label>
            <input
              type="text"
              value={formData.greeting}
              onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">Professional Title (EN)</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">Professional Title (বাংলা)</label>
          <input
            type="text"
            value={formData.titleBn}
            onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">Introduction Description (EN)</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">Introduction Description (বাংলা)</label>
          <textarea
            rows={2}
            value={formData.descriptionBn}
            onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Buttons Configuration */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-cyan-400">
          Action Buttons
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Hire Button Text</label>
            <input
              type="text"
              value={formData.hireBtnText}
              onChange={(e) => setFormData({ ...formData, hireBtnText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Hire Button Target Link</label>
            <input
              type="text"
              value={formData.hireBtnLink}
              onChange={(e) => setFormData({ ...formData, hireBtnLink: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">CV Button Text</label>
            <input
              type="text"
              value={formData.cvBtnText}
              onChange={(e) => setFormData({ ...formData, cvBtnText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">CV Download URL</label>
            <input
              type="text"
              value={formData.cvBtnLink}
              onChange={(e) => setFormData({ ...formData, cvBtnLink: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Hero Profile Photo & ImgBB Upload */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-cyan-400">
          Hero Profile Image (ImgBB Direct Upload)
        </h3>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full border-2 border-cyan-400 overflow-hidden shrink-0 bg-black">
            <img
              src={formData.profileImageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Image URL</label>
              <input
                type="text"
                value={formData.profileImageUrl}
                onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 text-xs font-mono transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading to ImgBB...' : 'Upload New Photo via ImgBB'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Terminal Card Content */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-cyan-400">
          Hero Terminal Text & Quote
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Terminal Status Line</label>
            <input
              type="text"
              value={formData.terminalStatus}
              onChange={(e) => setFormData({ ...formData, terminalStatus: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Terminal Bottom Quote</label>
            <input
              type="text"
              value={formData.terminalQuote}
              onChange={(e) => setFormData({ ...formData, terminalQuote: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save Hero Settings'}</span>
        </button>
      </div>
    </form>
  );
};
