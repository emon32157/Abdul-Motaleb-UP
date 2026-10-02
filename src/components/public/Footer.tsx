import React from 'react';
import { useData } from '../../context/DataContext';
import { Lock } from 'lucide-react';

interface FooterProps {
  onAdminLoginClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminLoginClick }) => {
  const { siteSettings } = useData();

  return (
    <footer className="border-t border-cyan-500/20 bg-[#040711] py-8 text-xs text-slate-400 relative z-20 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          {/* Copyright */}
          <div className="font-mono">
            {siteSettings.footerRights || '© 2026 Abdul Motaleb. All Rights Reserved.'}
          </div>

          {/* Core Roles */}
          <div className="text-slate-400 font-mono text-[11px] flex flex-wrap justify-center gap-2">
            <span className="text-cyan-400">Cyber Security</span>
            <span>|</span>
            <span className="text-emerald-400">Ethical Hacking</span>
            <span>|</span>
            <span className="text-blue-400">Web Development</span>
            <span>|</span>
            <span className="text-purple-400">Social Media</span>
          </div>

          {/* Right & Subtle Admin Login */}
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Made with <span className="text-rose-500">❤️</span> for a safer digital world.
            </span>

            {/* Discreet Admin Login */}
            <button
              onClick={onAdminLoginClick}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/30 px-2 py-0.5 rounded"
              title="Admin Console"
            >
              <Lock className="w-3 h-3 text-cyan-400/70" />
              <span>Admin Login</span>
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
