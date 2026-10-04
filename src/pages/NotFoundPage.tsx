import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, FolderGit2, Mail, ArrowLeft, Terminal } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050811] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <SEOHead
        title="404 - Page Not Found"
        description="The requested cyber security page or route could not be found."
        canonicalUrl="/404"
      />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg text-center space-y-8 p-8 rounded-3xl border border-cyan-500/30 bg-[#091022]/90 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,242,254,0.15)] animate-in fade-in duration-300">
        
        {/* Terminal Glitch Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs">
          <Terminal className="w-3.5 h-3.5" />
          <span>ERROR 404 • ROUTE_NOT_FOUND</span>
        </div>

        {/* Cyber Hologram Icon */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 rotate-6 shadow-[0_0_30px_rgba(0,242,254,0.3)] animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-[#060b18] border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.4)]">
            <ShieldAlert className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            The page you are looking for doesn't exist, has been moved, or the link may be outdated.
          </p>
          <p className="text-xs font-mono text-slate-500">
            [HTTP 404] Security scan returned 0 matching endpoints.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-black font-bold text-xs sm:text-sm hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>

          <Link
            to="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold text-xs sm:text-sm hover:bg-cyan-500/25 transition-all cursor-pointer"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>View Projects</span>
          </Link>
        </div>

        {/* Secondary Back Navigation */}
        <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between text-xs font-mono text-slate-400">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Page</span>
          </button>
          <Link to="/contact" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Report Broken Link</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
