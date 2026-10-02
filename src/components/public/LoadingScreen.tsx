import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING SYSTEM...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + Math.floor(Math.random() * 15) + 10);
        if (next >= 100) {
          clearInterval(timer);
          setStatusText('ACCESS GRANTED ✓');
          setTimeout(() => {
            onComplete();
          }, 450);
          return 100;
        }
        return next;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onComplete]);

  const totalBlocks = 20;
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const filledBlocks = Math.max(0, Math.min(totalBlocks, Math.round((clampedProgress / 100) * totalBlocks)));
  const emptyBlocks = Math.max(0, totalBlocks - filledBlocks);
  const barString = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050811] text-cyan-400 font-mono select-none px-4">
      {/* Background cyber grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-6 rounded-xl border border-cyan-500/30 bg-[#0a1020]/90 backdrop-blur-md shadow-[0_0_50px_rgba(0,242,254,0.15)] text-center">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-6 text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            SECURE PORTFOLIO GATEWAY
          </span>
          <span className="text-cyan-400/80">v2.6.0</span>
        </div>

        <div className="text-sm font-semibold tracking-wider mb-2 text-cyan-300">
          {statusText}
        </div>

        {/* Matrix Bar */}
        <div className="text-emerald-400 text-sm tracking-widest my-4 overflow-hidden">
          [{barString}] {Math.min(100, progress)}%
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-center gap-2 mt-4">
          <span>ROOT@ABDUL-MOTALEB</span>
          <span>•</span>
          <span className="text-cyan-400">CYBER_DEFENSE_READY</span>
        </div>
      </div>
    </div>
  );
};
