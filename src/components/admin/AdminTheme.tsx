import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeName } from '../../types';
import { Palette, CheckCircle, Save, Sparkles } from 'lucide-react';

export const AdminTheme: React.FC = () => {
  const { theme, setTheme, config, updateThemeConfig } = useTheme();
  const [currentConfig, setCurrentConfig] = useState({ ...config });
  const [notification, setNotification] = useState('');

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSelectTheme = (t: ThemeName) => {
    setTheme(t);
    setCurrentConfig((prev) => ({ ...prev, currentTheme: t }));
    showNotice(`Theme switched to ${t.toUpperCase()}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateThemeConfig(currentConfig);
    showNotice('Theme configuration saved!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Preset Theme Selection */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
          <Palette className="w-4 h-4" />
          <span>Active Visual Preset</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => handleSelectTheme('cyber-dark')}
            className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
              theme === 'cyber-dark'
                ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(0,242,254,0.3)]'
                : 'border-slate-800 bg-[#060b18] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#00f2fe]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#10b981]" />
            </div>
            <div className="font-bold text-xs text-white">Cyber Dark</div>
            <div className="text-[10px] text-slate-400 font-mono">Deep black, neon cyan & green</div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTheme('blue')}
            className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
              theme === 'blue'
                ? 'border-blue-400 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : 'border-slate-800 bg-[#060b18] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#38bdf8]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#6366f1]" />
            </div>
            <div className="font-bold text-xs text-white">Electric Blue</div>
            <div className="text-[10px] text-slate-400 font-mono">Navy cyber & sky blue</div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTheme('green')}
            className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
              theme === 'green'
                ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'border-slate-800 bg-[#060b18] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#10b981]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#059669]" />
            </div>
            <div className="font-bold text-xs text-white">Hacker Green</div>
            <div className="text-[10px] text-slate-400 font-mono">Matrix phosphor terminal</div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTheme('light')}
            className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
              theme === 'light'
                ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                : 'border-slate-800 bg-[#060b18] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0284c7]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#f4f6fa]" />
            </div>
            <div className="font-bold text-xs text-white">Cyber Light</div>
            <div className="text-[10px] text-slate-400 font-mono">High contrast crisp white/slate</div>
          </button>
        </div>
      </div>

      {/* Colors Customization */}
      <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-cyan-400">
          Accent Colors & Glow Intensity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Primary Neon Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentConfig.primaryColor}
                onChange={(e) => setCurrentConfig({ ...currentConfig, primaryColor: e.target.value })}
                className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={currentConfig.primaryColor}
                onChange={(e) => setCurrentConfig({ ...currentConfig, primaryColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Secondary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentConfig.secondaryColor}
                onChange={(e) => setCurrentConfig({ ...currentConfig, secondaryColor: e.target.value })}
                className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={currentConfig.secondaryColor}
                onChange={(e) => setCurrentConfig({ ...currentConfig, secondaryColor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Glow Intensity</label>
            <select
              value={currentConfig.glowIntensity}
              onChange={(e) =>
                setCurrentConfig({
                  ...currentConfig,
                  glowIntensity: e.target.value as 'subtle' | 'medium' | 'high'
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
            >
              <option value="subtle">Subtle</option>
              <option value="medium">Medium</option>
              <option value="high">High (Cyber Neon)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Theme Preferences</span>
        </button>
      </div>
    </form>
  );
};
