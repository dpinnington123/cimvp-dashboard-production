import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User, AuthError, SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import React from 'react';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithPassword: (credentials: SignInWithPasswordCredentials) => Promise<{ error: AuthError | null }>;
  // Add signUp function placeholder if needed later
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async (sessionData: Session | null) => {
      setSession(sessionData);
      setUser(sessionData?.user ?? null);
      setLoading(false);
    };

    // Initial check on component mount
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
        setData(initialSession);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sessionData) => {
      console.log("Auth State Change:", _event, sessionData); // Log auth changes
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
      // State updates (session, user, loading) handled by onAuthStateChange listener
      // We set loading back to false inside the listener (setData)
      // Return the error object so the calling component can handle UI feedback
      if (error) {
          console.error('Sign in error:', error);
          setLoading(false); // Ensure loading is false if there's an immediate error
      }
      return { error };
  };

  const signOut = async () => {
    setLoading(true); // Optional: show loading state during sign out
    const { error } = await supabase.auth.signOut();
    // State updates handled by onAuthStateChange
    if(error) {
        console.error('Sign out error:', error);
        setLoading(false); // Ensure loading is false if there's an error
    }
    return { error };
  };

  // Add signUp implementation here later if needed

  const value = {
    session,
    user,
    loading,
    signInWithPassword,
    signOut,
  };

  // Render children only when the initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading || session ? children : null}
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