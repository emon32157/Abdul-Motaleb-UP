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
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Purge any legacy demo admin bypass flags from local storage
    try {
      localStorage.removeItem('am_demo_admin');
    } catch {
      // ignore
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user);
          setLoading(false);
        },
        (err) => {
          console.warn('Firebase auth state notice:', err);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firebase auth initialization notice:', e);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    try {
      // Authenticate directly with Firebase Auth - strict admin login only
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      return true;
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      console.warn('Firebase Auth sign-in code:', firebaseError?.code || firebaseError);

      let message = 'ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে। দয়া করে পুনরায় যাচাই করুন।';
      if (
        firebaseError.code === 'auth/user-not-found' ||
        firebaseError.code === 'auth/wrong-password' ||
        firebaseError.code === 'auth/invalid-credential' ||
        firebaseError.code === 'auth/invalid-login-credentials'
      ) {
        message = 'ইমেইল বা পাসওয়ার্ড সঠিক নয়। শুধুমাত্র ফায়ারবেসে নিবন্ধিত অনুমোদিত এডমিন একাউন্ট প্রবেশ করতে পারবে।';
      } else if (firebaseError.code === 'auth/too-many-requests') {
        message = 'একাধিকবার ব্যর্থ চেষ্টার কারণে এক্সেস সাময়িকভাবে স্থগিত করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।';
      } else if (firebaseError.code === 'auth/user-disabled') {
        message = 'এই এডমিন অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।';
      } else if (firebaseError.code === 'auth/invalid-email') {
        message = 'দয়া করে একটি সঠিক ও কার্যকর ইমেইল এড্রেস লিখুন।';
      } else if (firebaseError.message) {
        message = firebaseError.message;
      }
      setError(message);
      return false;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout notice:', e);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      console.warn('Firebase Auth password reset error code:', firebaseError?.code || firebaseError);
      let message = 'পাসওয়ার্ড পুনরুদ্ধার ইমেইল পাঠাতে সমস্যা হয়েছে।';
      if (firebaseError.code === 'auth/user-not-found') {
        message = 'এই ইমেইলটি ফায়ারবেসে নিবন্ধিত নয়।';
      } else if (firebaseError.code === 'auth/invalid-email') {
        message = 'দয়া করে সঠিক ইমেইল এড্রেস দিন।';
      } else if (firebaseError.message) {
        message = firebaseError.message;
      }
      setError(message);
      return false;
    }
  };

  const clearError = () => setError(null);

  // STRICT SECURITY: Access is granted ONLY when a valid Firebase authenticated user exists
  const isAdmin = !!currentUser;

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
        clearError
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
