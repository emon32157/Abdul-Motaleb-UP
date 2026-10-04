import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050811] flex flex-col items-center justify-center space-y-4 font-mono text-cyan-400">
        <div className="w-12 h-12 rounded-2xl border-2 border-cyan-400 border-t-transparent animate-spin shadow-[0_0_25px_rgba(0,242,254,0.4)]" />
        <div className="text-center space-y-1">
          <p className="text-xs text-cyan-300 font-semibold tracking-wider animate-pulse flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>VERIFYING CRYPTOGRAPHIC CREDENTIALS...</span>
          </p>
          <p className="text-[11px] text-slate-500">Checking Firebase Authentication Token</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
