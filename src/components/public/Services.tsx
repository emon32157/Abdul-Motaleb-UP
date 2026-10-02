import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldCheck,
  Lock,
  Globe,
  Layout,
  TrendingUp,
  Key,
  ArrowRight,
  Shield
} from 'lucide-react';

export const Services: React.FC = () => {
  const { services } = useData();
  const { lang } = useLanguage();

  const getServiceIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case 'shieldcheck':
        return <ShieldCheck className="w-6 h-6 text-cyan-400" />;
      case 'lock':
        return <Lock className="w-6 h-6 text-emerald-400" />;
      case 'globe':
        return <Globe className="w-6 h-6 text-blue-400" />;
      case 'layout':
        return <Layout className="w-6 h-6 text-purple-400" />;
      case 'trendingup':
        return <TrendingUp className="w-6 h-6 text-pink-400" />;
      case 'key':
        return <Key className="w-6 h-6 text-amber-400" />;
      default:
        return <Shield className="w-6 h-6 text-cyan-400" />;
    }
  };

  const activeServices = services
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="services" className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase">
            <span>&lt;/&gt;</span>
            <span>{lang === 'bn' ? 'সেবা সমূহ' : 'My Services'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {lang === 'bn' ? 'আমি যা প্রদান করি' : 'What I Do'}
          </h2>
        </div>

        {/* 3x2 Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.map((service) => (
            <div
              key={service.id}
              className="group p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md hover:border-cyan-400/50 hover:bg-[#0c162d]/90 hover:shadow-[0_8px_30px_rgba(0,242,254,0.15)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon box */}
                <div className="w-12 h-12 rounded-xl border border-cyan-500/30 bg-[#060b18] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(0,242,254,0.15)]">
                  {getServiceIcon(service.icon)}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {lang === 'bn' ? service.titleBn || service.title : service.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang === 'bn' ? service.descriptionBn || service.description : service.description}
                </p>
              </div>

              {/* Action Link */}
              <div className="pt-6 mt-4 border-t border-cyan-500/10 flex items-center justify-between">
                <a
                  href={service.buttonUrl || '#contact'}
                  className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 group-hover:text-emerald-300 transition-colors"
                >
                  <span>{lang === 'bn' ? 'বিস্তারিত' : service.buttonText || 'Explore Service'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="w-7 h-7 rounded-full border border-cyan-500/20 flex items-center justify-center text-slate-400 group-hover:border-cyan-400 group-hover:text-cyan-400 transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
