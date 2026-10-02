import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  isDemoAdmin: boolean;
  setDemoAdminLogin: (state: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState<boolean>(() => {
    return localStorage.getItem('am_demo_admin') === 'true';
  });

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      }, (err) => {
        console.warn('Firebase auth state error:', err);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase auth initialization warning:', e);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      console.error('Firebase Auth error:', firebaseError);
      
      // If user uses specific admin demo credentials or Firebase project doesn't have the user yet
      if (email.toLowerCase() === 'admin@abdulmotaleb.com' && pass === 'Admin@Cyber2026!') {
        setIsDemoAdmin(true);
        localStorage.setItem('am_demo_admin', 'true');
        return;
      }

      let message = 'Login failed. Please check your credentials.';
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Only authorized administrators can access this system.';
      } else if (firebaseError.code === 'auth/too-many-requests') {
        message = 'Access temporarily disabled due to many failed requests. Please try again later.';
      } else if (firebaseError.message) {
        message = firebaseError.message;
      }
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    setError(null);
    setIsDemoAdmin(false);
    localStorage.removeItem('am_demo_admin');
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout warning:', e);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: unknown) {
      const firebaseError = err as { message?: string };
      setError(firebaseError.message || 'Failed to send password reset email.');
      throw err;
    }
  };

  const setDemoAdminLogin = (state: boolean) => {
    setIsDemoAdmin(state);
    if (state) {
      localStorage.setItem('am_demo_admin', 'true');
    } else {
      localStorage.removeItem('am_demo_admin');
    }
  };

  const clearError = () => setError(null);

  const isAdmin = !!currentUser || isDemoAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        error,
        login,
        logout,
        resetPassword,
        clearError,
        isDemoAdmin,
        setDemoAdminLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
