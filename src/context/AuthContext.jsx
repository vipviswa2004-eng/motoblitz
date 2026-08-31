import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const ADMIN_EMAILS = [
  'viswakumar2004@gmail.com',
  'maxthvel@gmail.com',
];
export const ADMIN_EMAIL = ADMIN_EMAILS[0];
const STORAGE_USER_KEY = 'motoblitz_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get current active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
        };
        setUser(userData);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
        };
        setUser(userData);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
      } else {
        // Clear user on explicit sign out
        setUser(null);
        localStorage.removeItem(STORAGE_USER_KEY);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Google OAuth Login via Supabase
   */
  const signInWithGoogle = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
      if (error) throw error;
      return;
    }

    // Fallback Mock Google Login when Supabase keys are pending in .env
    const mockUser = {
      id: 'mock-google-' + Date.now(),
      email: 'viswakumar2004@gmail.com',
      name: 'Viswa Kumar',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    };
    setUser(mockUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mockUser));
    setIsLoginModalOpen(false);
  };

  /**
   * Demo Rider Login for quick testing
   */
  const signInAsRider = (email = 'rider@motoblitz.in', name = 'Speed Rider') => {
    const mockUser = {
      id: 'mock-rider-' + Date.now(),
      email,
      name,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
    };
    setUser(mockUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mockUser));
    setIsLoginModalOpen(false);
  };

  /**
   * Sign Out
   */
  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  const isAdmin = Boolean(
    user?.email &&
    ADMIN_EMAILS.some(e => e.toLowerCase() === user.email.toLowerCase())
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        ADMIN_EMAIL,
        ADMIN_EMAILS,
        isLoginModalOpen,
        setIsLoginModalOpen,
        signInWithGoogle,
        signInAsRider,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
