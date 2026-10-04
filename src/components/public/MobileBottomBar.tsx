import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Briefcase, Mail, MessageCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const MobileBottomBar: React.FC = () => {
  const { siteSettings } = useData();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070c1a]/95 backdrop-blur-xl border-t border-cyan-500/25 px-4 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-mono transition-colors ${
            isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-cyan-400'
          }`
        }
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-mono transition-colors ${
            isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-cyan-400'
          }`
        }
      >
        <User className="w-4 h-4" />
        <span>About</span>
      </NavLink>

      <NavLink
        to="/projects"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-mono transition-colors ${
            isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-cyan-400'
          }`
        }
      >
        <Briefcase className="w-4 h-4" />
        <span>Projects</span>
      </NavLink>

      <NavLink
        to="/contact"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-mono transition-colors ${
            isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-cyan-400'
          }`
        }
      >
        <Mail className="w-4 h-4" />
        <span>Contact</span>
      </NavLink>

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
