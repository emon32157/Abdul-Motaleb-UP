import React from 'react';
import { Home, User, Briefcase, Mail, MessageCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const MobileBottomBar: React.FC = () => {
  const { siteSettings } = useData();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070c1a]/95 backdrop-blur-xl border-t border-cyan-500/25 px-4 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <a
        href="#home"
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 text-[10px] font-mono transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </a>

      <a
        href="#about"
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 text-[10px] font-mono transition-colors"
      >
        <User className="w-4 h-4" />
        <span>About</span>
      </a>

      <a
        href="#projects"
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 text-[10px] font-mono transition-colors"
      >
        <Briefcase className="w-4 h-4" />
        <span>Projects</span>
      </a>

      <a
        href="#contact"
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 text-[10px] font-mono transition-colors"
      >
        <Mail className="w-4 h-4" />
        <span>Contact</span>
      </a>

      {siteSettings.whatsapp && (
        <a
          href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-emerald-400 hover:text-emerald-300 text-[10px] font-mono transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat</span>
        </a>
      )}
    </div>
  );
};
