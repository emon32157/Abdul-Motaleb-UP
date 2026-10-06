import React from 'react';
import { useData } from '../../context/DataContext';
import { Lock } from 'lucide-react';
import { formatSocialUrl, getSocialIconComponent } from '../../utils/socialUtils';

interface FooterProps {
  onAdminLoginClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminLoginClick }) => {
  const { siteSettings, socialLinks } = useData();

  const activeSocials = socialLinks
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order);

  return (
    <footer className="border-t border-cyan-500/20 bg-[#040711] py-8 text-xs text-slate-400 relative z-20 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          {/* Copyright */}
          <div className="font-mono text-slate-400">
            {siteSettings.footerRights || '© 2026 Abdul Motaleb. All Rights Reserved.'}
          </div>

          {/* Social Media Channels Row */}
          {activeSocials.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {activeSocials.map((social) => (
                <a
                  key={social.id}
                  href={formatSocialUrl(social.url, social.platform)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.title}
                  className="w-8 h-8 rounded-full border border-cyan-500/25 bg-[#080f20] flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all hover:scale-110 hover:shadow-[0_0_10px_rgba(0,242,254,0.3)]"
                >
                  {getSocialIconComponent(social.platform, 'w-3.5 h-3.5')}
                </a>
              ))}
            </div>
          )}

          {/* Right & Discreet Admin Login */}
          <div className="flex items-center gap-3">
            <button
              onClick={onAdminLoginClick}
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/30 px-2 py-0.5 rounded font-mono"
              title="Admin Console"
            >
              <Lock className="w-3 h-3 text-cyan-400/70" />
              <span>Admin Login</span>
            </button>
          </div>

        </div>

        {/* Roles Line */}
        <div className="text-slate-500 font-mono text-[10px] flex flex-wrap justify-center md:justify-start gap-2 pt-1 border-t border-cyan-500/10">
          <span className="text-cyan-400/80">Cyber Security</span>
          <span>•</span>
          <span className="text-emerald-400/80">Ethical Hacking</span>
          <span>•</span>
          <span className="text-blue-400/80">Web Development</span>
          <span>•</span>
          <span className="text-purple-400/80">Social Media Marketing</span>
        </div>
      </div>
    </footer>
  );
};
