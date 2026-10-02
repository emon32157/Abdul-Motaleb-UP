import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Moon,
  Globe,
  ArrowUp,
  Smartphone,
  MousePointer,
  Sparkles,
  Check
} from 'lucide-react';

export const ExtraFeaturesCard: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 rounded-2xl border border-cyan-500/25 bg-[#0a1224]/85 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-6">
      <div>
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Control Center</span>
        </div>
        <h3 className="text-lg font-bold text-white mt-1">Extra Features</h3>
      </div>

      {/* Feature Bullet List */}
      <div className="space-y-3 font-mono text-xs text-slate-300">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#060b18] border border-cyan-500/15">
          <span className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-cyan-400" />
            <span>Dark / Light / Hacker Theme</span>
          </span>
          <span className="text-emerald-400 font-bold">✓</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#060b18] border border-cyan-500/15">
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Multi Language (Bangla / English)</span>
          </span>
          <button
            onClick={toggleLang}
            className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[10px]"
          >
            {lang === 'en' ? 'SWITCH TO বাংলা' : 'SWITCH TO EN'}
          </button>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#060b18] border border-cyan-500/15">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Smooth Scroll Animation</span>
          </span>
          <span className="text-emerald-400 font-bold">✓</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#060b18] border border-cyan-500/15">
          <span className="flex items-center gap-2">
            <ArrowUp className="w-4 h-4 text-purple-400" />
            <span>Back to Top Button</span>
          </span>
          <button
            onClick={scrollToTop}
            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px]"
          >
            SCROLL TOP
          </button>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#060b18] border border-cyan-500/15">
          <span className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-pink-400" />
            <span>Responsive Design (Mobile + Desktop)</span>
          </span>
          <span className="text-emerald-400 font-bold">✓</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#060b18] border border-cyan-500/15">
          <span className="flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-amber-400" />
            <span>Custom Cursor</span>
          </span>
          <span className="text-emerald-400 font-bold">ACTIVE</span>
        </div>
      </div>

      {/* Theme Switcher Row */}
      <div className="pt-4 border-t border-cyan-500/15">
        <h4 className="text-xs font-mono text-slate-400 uppercase mb-3">Theme Switcher</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setTheme('cyber-dark')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-mono transition-all ${
              theme === 'cyber-dark'
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                : 'border-slate-800 bg-[#060b18] text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Cyber Dark</span>
          </button>

          <button
            onClick={() => setTheme('blue')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-mono transition-all ${
              theme === 'blue'
                ? 'border-blue-400 bg-blue-500/20 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : 'border-slate-800 bg-[#060b18] text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Blue</span>
          </button>

          <button
            onClick={() => setTheme('green')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-mono transition-all ${
              theme === 'green'
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'border-slate-800 bg-[#060b18] text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Green</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-mono transition-all ${
              theme === 'light'
                ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'border-slate-800 bg-[#060b18] text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Light</span>
          </button>
        </div>
      </div>
    </div>
  );
};
