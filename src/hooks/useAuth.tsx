import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User, AuthError, SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import React from 'react';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  emailVerified: boolean;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithPassword: (credentials: SignInWithPasswordCredentials) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null, data: any }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const setData = async (sessionData: Session | null) => {
      setSession(sessionData);
      setUser(sessionData?.user ?? null);

      // Check email verification status if user exists
      let isVerified = false;
      if (sessionData?.user) {
        isVerified = sessionData.user.email_confirmed_at !== null;
      }
      setEmailVerified(isVerified);

      setLoading(false);
    };

    // Initial check on component mount
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setData(initialSession);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sessionData) => {
      setData(sessionData);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithPassword = async (credentials: SignInWithPasswordCredentials) => {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) {
          console.error('Sign in error:', error);
          setLoading(false);
      }
      return { error };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if(error) {
        console.error('Sign out error:', error);
        setLoading(false);
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/login'
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      setLoading(false);
    }

    return { data, error };
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    setLoading(false);
    
    return { error };
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    setLoading(false);
    
    return { error };
  };

  const value = {
    session,
    user,
    loading,
    emailVerified,
    signInWithPassword,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
  };

  // Always render children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 