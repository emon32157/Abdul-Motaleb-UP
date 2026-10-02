import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, Terminal } from 'lucide-react';

export const About: React.FC = () => {
  const { about } = useData();
  const { lang } = useLanguage();

  return (
    <section id="about" className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase">
            <span>&lt;/&gt;</span>
            <span>{lang === 'bn' ? 'আমার পরিচিতি' : 'About Me'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {lang === 'bn' ? 'আমাকে জানুন' : 'Get to know me'}
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Terminal Card About_Me.exe (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-cyan-500/30 bg-[#091022]/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden font-mono text-xs">
              {/* Window Title Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#060b18] border-b border-cyan-500/20">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold tracking-wide">About_Me.exe</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full border border-slate-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full border border-slate-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full border border-rose-500/80 inline-block text-[8px] flex items-center justify-center leading-none text-rose-300">✕</span>
                </div>
              </div>

              {/* Terminal Key-Value Table */}
              <div className="p-5 space-y-2.5 text-slate-300 font-mono text-xs leading-relaxed">
                <div className="flex">
                  <span className="text-cyan-400 w-28 shrink-0">Name</span>
                  <span className="text-slate-500 mx-1">:</span>
                  <span className="text-white font-medium">{about.name}</span>
                </div>
                <div className="flex">
                  <span className="text-cyan-400 w-28 shrink-0">Role</span>
                  <span className="text-slate-500 mx-1">:</span>
                  <span className="text-emerald-300">{about.role}</span>
                </div>
                <div className="flex">
                  <span className="text-cyan-400 w-28 shrink-0">Speciality</span>
                  <span className="text-slate-500 mx-1">:</span>
                  <span className="text-slate-200">{about.speciality}</span>
                </div>
                <div className="flex">
                  <span className="text-cyan-400 w-28 shrink-0">Developer</span>
                  <span className="text-slate-500 mx-1">:</span>
                  <span className="text-slate-200">{about.developer}</span>
                </div>
                <div className="flex">
                  <span className="text-cyan-400 w-28 shrink-0">Location</span>
                  <span className="text-slate-500 mx-1">:</span>
                  <span className="text-slate-200">{about.location}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-cyan-400 w-28 shrink-0">Status</span>
                  <span className="text-slate-500 mx-1">:</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {about.status}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-cyan-400 w-28 shrink-0">Languages</span>
                  <span className="text-slate-500 mx-1">:</span>
                  <span className="text-slate-300">{about.languages}</span>
                </div>

                <div className="pt-3 mt-3 border-t border-cyan-500/15 text-emerald-400/90 flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">&gt;</span>
                  <span>{about.terminalFooter || 'Ready for new challenges...'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bio & Highlights (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              {lang === 'bn' ? about.bioBn || about.bioEn : about.bioEn}
            </p>

            {/* Checkmark Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(lang === 'bn' && about.highlightsBn && about.highlightsBn.length > 0
                ? about.highlightsBn
                : about.highlights
              ).map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
