import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sun, Moon, Terminal, Menu, X, Shield, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const { navigation, siteSettings } = useData();
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeNav = navigation
    .filter((item) => item.active)
    .sort((a, b) => a.order - b.order);

  const cycleTheme = () => {
    if (theme === 'cyber-dark') setTheme('blue');
    else if (theme === 'blue') setTheme('green');
    else if (theme === 'green') setTheme('light');
    else setTheme('cyber-dark');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060913]/90 backdrop-blur-md border-b border-cyan-500/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#home"
          className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-white group"
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all">
            <span className="font-mono text-sm font-semibold">&lt;/&gt;</span>
          </div>
          <span className="font-sans font-bold bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
            {siteSettings.logoText || 'Abdul Motaleb'}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {activeNav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              {lang === 'bn' ? item.titleBn || item.title : item.title}
            </a>
          ))}
        </nav>

        {/* Action Controls: Language, Theme & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            title="Switch Language (English / বাংলা)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/5 text-xs font-mono text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/15 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Theme Switcher Toggle Pill */}
          <button
            onClick={cycleTheme}
            title={`Current Theme: ${theme.toUpperCase()}. Click to switch.`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-[#0a1224]/80 text-xs text-slate-300 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
          >
            {theme === 'cyber-dark' && (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline text-[11px] font-mono text-cyan-400">DARK</span>
              </>
            )}
            {theme === 'blue' && (
              <>
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline text-[11px] font-mono text-blue-400">BLUE</span>
              </>
            )}
            {theme === 'green' && (
              <>
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-[11px] font-mono text-emerald-400">GREEN</span>
              </>
            )}
            {theme === 'light' && (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-[11px] font-mono text-amber-500">LIGHT</span>
              </>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:border-cyan-400 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-cyan-500/20 bg-[#070c1a]/95 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {activeNav.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-cyan-400 hover:bg-cyan-500/10 border-l-2 border-transparent hover:border-cyan-400 transition-all"
              >
                {lang === 'bn' ? item.titleBn || item.title : item.title}
              </a>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-cyan-500/15 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ACTIVE
            </span>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold text-xs"
            >
              {lang === 'bn' ? 'মেসেজ দিন' : 'Contact Me'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
