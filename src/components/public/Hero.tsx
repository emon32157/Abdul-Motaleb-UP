import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Download, Send, Facebook, Github, Linkedin, Youtube, MessageCircle, Terminal, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  const { hero, socialLinks, siteSettings } = useData();
  const { lang } = useLanguage();
  const [typedText, setTypedText] = useState('');
  const fullText = "user@portfolio:~$ whoami\nAbdul Motaleb\n\nuser@portfolio:~$ profession\nCyber Security Expert\nEthical Hacker\nWeb Developer\nSocial Media Expert\n\nuser@portfolio:~$ status\n● Available for work";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 28);
    return () => clearInterval(interval);
  }, []);

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <ShieldCheck className="w-4 h-4" />;
    }
  };

  return (
    <section
      id="home"
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden"
    >
      {/* Background cyber lighting ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Introductions & CTAs (5 cols) */}
          <div className="lg:col-span-5 text-left space-y-5">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span>{lang === 'bn' ? hero.badgeTextBn || hero.badgeText : hero.badgeText}</span>
            </div>

            {/* Greeting & Headline */}
            <div>
              <p className="text-slate-400 text-base sm:text-lg font-mono">
                {lang === 'bn' ? hero.greetingBn || hero.greeting : hero.greeting}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-1">
                <span className="text-white">Abdul </span>
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Motaleb
                </span>
              </h1>
            </div>

            {/* Professional Titles */}
            <div className="border-l-2 border-cyan-500/50 pl-4 py-1">
              <p className="text-cyan-300 font-semibold text-sm sm:text-base leading-relaxed tracking-wide font-mono">
                Cyber Security Expert | Ethical Hacker
              </p>
              <p className="text-emerald-400 font-medium text-xs sm:text-sm leading-relaxed tracking-wide font-mono mt-0.5">
                Social Media Expert | Web Developer
              </p>
            </div>

            {/* Short Introduction */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
              {lang === 'bn' ? hero.descriptionBn || hero.description : hero.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={hero.hireBtnLink && hero.hireBtnLink.startsWith('#') ? `/${hero.hireBtnLink.replace('#', '')}` : (hero.hireBtnLink || '/contact')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-[#050811] font-bold text-sm hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'bn' ? 'হায়ার করুন' : hero.hireBtnText || 'Hire Me'}</span>
              </Link>

              <a
                href={hero.cvBtnLink && hero.cvBtnLink !== '#' ? hero.cvBtnLink : (siteSettings.cvUrl || '#')}
                download
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-cyan-500/40 bg-slate-900/80 text-cyan-300 hover:text-white font-medium text-sm hover:border-cyan-400 hover:bg-cyan-500/10 transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'সিভি ডাউনলোড' : hero.cvBtnText || 'Download CV'}</span>
              </a>
            </div>

            {/* Social Links Row */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks
                .filter((s) => s.active)
                .sort((a, b) => a.order - b.order)
                .map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.title}
                    className="w-9 h-9 rounded-full border border-cyan-500/30 bg-[#0a1224]/80 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,242,254,0.4)] transition-all hover:-translate-y-0.5"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
            </div>
          </div>

          {/* Center Column: Cyber Profile Portal (4 cols) */}
          <div className="lg:col-span-3 flex justify-center items-center my-4 lg:my-0">
            <div className="relative group">
              {/* Outer Glowing Cyber Ring */}
              <div className="w-60 h-60 sm:w-68 sm:h-68 lg:w-72 lg:h-72 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-emerald-400 to-blue-500 shadow-[0_0_40px_rgba(0,242,254,0.35)] animate-pulse">
                {/* Secondary inner ring with border */}
                <div className="w-full h-full rounded-full p-1 bg-[#060913] flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-cyan-400/40 bg-slate-950 relative">
                    <img
                      src={hero.profileImageUrl || 'https://iili.io/Bev2e8G.jpg'}
                      alt={hero.name}
                      className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060913]/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Floating < / > Code Badge */}
              <div className="absolute -bottom-2 right-4 px-3.5 py-1.5 rounded-lg border border-cyan-400/60 bg-[#070d1e]/90 text-cyan-300 font-mono text-sm font-bold shadow-[0_0_15px_rgba(0,242,254,0.4)] flex items-center gap-1.5 backdrop-blur-md">
                <span>&lt;/&gt;</span>
              </div>
            </div>
          </div>

          {/* Right Column: Terminal Window Card (4 cols) */}
          <div className="lg:col-span-4 w-full">
            <div className="rounded-xl border border-cyan-500/30 bg-[#0a1224]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden font-mono text-xs">
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#080d1c] border-b border-cyan-500/20">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>bash - 80x24</span>
                </div>
                <div className="w-8" />
              </div>

              {/* Terminal Content */}
              <div className="p-4 sm:p-5 space-y-3 min-h-[220px] text-slate-300 leading-relaxed overflow-x-auto">
                <div className="whitespace-pre-line text-emerald-400/90 font-mono text-xs">
                  {typedText}
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-400 cursor-blink align-middle" />
                </div>
              </div>

              {/* Quote at bottom of terminal */}
              <div className="px-4 py-3 bg-[#070b17] border-t border-cyan-500/15 text-slate-400 italic text-[11px] text-center font-sans">
                {hero.terminalQuote || '"Security is not a product, it\'s a process."'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
