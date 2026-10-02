import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Terminal, Globe, Users, Award, Briefcase, Zap } from 'lucide-react';

export const Stats: React.FC = () => {
  const { stats } = useData();
  const { lang } = useLanguage();

  const getStatIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'terminal':
        return <Terminal className="w-6 h-6 text-cyan-400" />;
      case 'globe':
        return <Globe className="w-6 h-6 text-emerald-400" />;
      case 'users':
        return <Users className="w-6 h-6 text-blue-400" />;
      case 'award':
        return <Award className="w-6 h-6 text-purple-400" />;
      default:
        return <Zap className="w-6 h-6 text-cyan-400" />;
    }
  };

  const activeStats = stats
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="py-12 relative">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase">
          <span>&lt;/&gt;</span>
          <span>{lang === 'bn' ? 'পরিসংখ্যান' : 'My Stats'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
          {lang === 'bn' ? 'গুরুত্বপূর্ণ সংখ্যাসমূহ' : 'Numbers That Matter'}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {activeStats.map((stat) => (
          <div
            key={stat.id}
            className="group p-5 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md hover:border-cyan-400/50 hover:bg-[#0c162d]/90 hover:shadow-[0_8px_30px_rgba(0,242,254,0.15)] transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-xl border border-cyan-500/30 bg-[#060b18] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,242,254,0.15)]">
              {getStatIcon(stat.icon)}
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
              {stat.number}
            </div>

            <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
              {lang === 'bn' ? stat.labelBn || stat.label : stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
