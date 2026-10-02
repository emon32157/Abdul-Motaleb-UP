import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Save, CheckCircle, Plus, Trash2 } from 'lucide-react';

export const AdminAbout: React.FC = () => {
  const { about, updateAbout } = useData();
  const [formData, setFormData] = useState({ ...about });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateAbout(formData);
      setSuccessMsg('About section updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleHighlightChange = (index: number, val: string) => {
    const list = [...formData.highlights];
    list[index] = val;
    setFormData({ ...formData, highlights: list });
  };

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const removeHighlight = (index: number) => {
    const list = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: list });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Terminal Card Info */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-cyan-400">
          Terminal Card Properties (About_Me.exe)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Speciality</label>
            <input
              type="text"
              value={formData.speciality}
              onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Developer Domain</label>
            <input
              type="text"
              value={formData.developer}
              onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Status</label>
            <input
              type="text"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Languages</label>
            <input
              type="text"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">Terminal Footer Line</label>
          <input
            type="text"
            value={formData.terminalFooter}
            onChange={(e) => setFormData({ ...formData, terminalFooter: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>
      </div>

      {/* Bio Descriptions */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-cyan-400">
          Professional Bio
        </h3>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">Bio (English)</label>
          <textarea
            rows={3}
            value={formData.bioEn}
            onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 mb-1">Bio (বাংলা)</label>
          <textarea
            rows={3}
            value={formData.bioBn}
            onChange={(e) => setFormData({ ...formData, bioBn: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
          />
        </div>
      </div>

      {/* Highlights Checkmarks */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-cyan-400">
            Strengths & Highlights
          </h3>
          <button
            type="button"
            onClick={addHighlight}
            className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Highlight</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formData.highlights.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleHighlightChange(idx, e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => removeHighlight(idx)}
                className="p-1.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
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
          <span>{saving ? 'Saving Changes...' : 'Save About Settings'}</span>
        </button>
      </div>
    </form>
  );
};
