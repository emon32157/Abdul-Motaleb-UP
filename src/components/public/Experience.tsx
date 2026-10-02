import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, Code, TrendingUp, Cpu } from 'lucide-react';

export const Experience: React.FC = () => {
  const { experience } = useData();
  const { lang } = useLanguage();

  const getExpIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'shield':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'code':
        return <Code className="w-4 h-4 text-cyan-400" />;
      case 'trendingup':
        return <TrendingUp className="w-4 h-4 text-purple-400" />;
      default:
        return <Cpu className="w-4 h-4 text-amber-400" />;
    }
  };

  const activeExp = experience
    .filter((e) => e.active)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="experience" className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase">
            <span>&lt;/&gt;</span>
            <span>{lang === 'bn' ? 'কাজের অভিজ্ঞতা' : 'My Experience'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {lang === 'bn' ? 'আমার পথচলা' : 'My Journey'}
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 border-l-2 border-cyan-500/25 space-y-10">
          {activeExp.map((item) => (
            <div key={item.id} className="relative group">
              
              {/* Timeline Diamond Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-[#070e1e] border border-cyan-400/60 shadow-[0_0_12px_rgba(0,242,254,0.35)] rotate-45 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-400 transition-all">
                  <div className="-rotate-45">
                    {getExpIcon(item.icon)}
                  </div>
                </div>
              </div>

              {/* Card Container */}
              <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md group-hover:border-cyan-400/50 group-hover:bg-[#0c162d]/90 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {item.year}
                  </span>
                  {item.organization && (
                    <span className="text-xs font-mono text-slate-400">
                      {item.organization}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {lang === 'bn' ? item.positionBn || item.position : item.position}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-mono">
                  {lang === 'bn' ? item.descriptionBn || item.description : item.description}
                </p>

                {item.skills && item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-cyan-500/10">
                    {item.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900/80 text-emerald-400/90 border border-emerald-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
