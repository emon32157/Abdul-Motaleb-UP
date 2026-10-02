import React from 'react';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';

interface MaintenanceScreenProps {
  onAdminLoginClick: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ onAdminLoginClick }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050811] text-white p-4 relative overflow-hidden font-mono">
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full p-8 rounded-2xl border border-cyan-500/30 bg-[#091022]/90 backdrop-blur-xl shadow-[0_0_50px_rgba(0,242,254,0.15)] text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
            SYSTEM MAINTENANCE PROTOCOL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Website Under Maintenance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-sans mt-3 leading-relaxed">
            We are currently executing scheduled security patches and infrastructure upgrades. We will be back online shortly.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#060b18] border border-cyan-500/15 text-left text-xs space-y-1 text-slate-400">
          <div className="flex justify-between">
            <span>TARGET_SYSTEM:</span>
            <span className="text-cyan-300">ABDUL_MOTALEB_SECURITY_HUB</span>
          </div>
          <div className="flex justify-between">
            <span>STATUS:</span>
            <span className="text-amber-400 animate-pulse">UPGRADING FIREWALLS...</span>
          </div>
        </div>

        {/* Discreet Admin Login Link */}
        <div className="pt-4 border-t border-cyan-500/15 flex items-center justify-center">
          <button
            onClick={onAdminLoginClick}
            className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Administrator Gateway</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
