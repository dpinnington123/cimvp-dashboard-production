import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User, AuthError, SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  emailVerified: boolean;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithPassword: (credentials: SignInWithPasswordCredentials) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: AuthError | null, data: any }>;
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
  const queryClient = useQueryClient();

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sessionData) => {
      setData(sessionData);
      
      // Invalidate all queries when auth state changes to force fresh data
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await queryClient.invalidateQueries();
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient]);

  const signInWithPassword = async (credentials: SignInWithPasswordCredentials) => {
      setLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword(credentials);
      if (error) {
          console.error('Sign in error:', error);
          setLoading(false);
      } else if (data.session) {
          // Immediately invalidate all queries after successful sign in
          await queryClient.invalidateQueries();
      }
      return { error };
  };

  const signOut = async () => {
    setLoading(true);
    
    try {
      // Force a new session check before attempting to sign out
      const { data } = await supabase.auth.getSession();
      
      // If we have no session, consider the user already signed out
      if (!data.session) {
        console.log('No active session found, user already signed out');
        // Clear any local state regardless
        setSession(null);
        setUser(null);
        setLoading(false);
        return { error: null };
      }
      
      // Proceed with sign out since we have a session
      const { error } = await supabase.auth.signOut();
      
      if(error) {
        console.error('Sign out error:', error);
      } else {
        // Ensure local state is cleared even if there was an error
        setSession(null);
        setUser(null);
      }
      
      setLoading(false);
      return { error };
    } catch (err) {
      console.error('Sign out exception:', err);
      // Clear local state on error too
      setSession(null);
      setUser(null);
      setLoading(false);
      // Return the caught error
      return { error: err as AuthError };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/login',
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`
        }
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
    console.log('Attempting password reset for email:', email);
    console.log('Redirect URL:', `${window.location.origin}/reset-password`);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Password reset error:', error);
    } else {
      console.log('Password reset email sent successfully');
    }
    
    setLoading(false);
    
    return { error };
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    try {
      // First verify we have a session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.error('Cannot update password: No active session');
        setLoading(false);
        return { 
          error: {
            message: 'No active session found',
            name: 'AuthApiError'
          } as unknown as AuthError
        };
      }
      
      // Then update the password
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        console.error('Password update error:', error);
      } else {
        console.log('Password updated successfully');
      }
      
      setLoading(false);
      return { error };
    } catch (err) {
      console.error('Exception during password update:', err);
      setLoading(false);
      return { 
        error: {
          message: err instanceof Error ? err.message : 'Unknown error',
          name: 'AuthApiError'
        } as unknown as AuthError 
      };
    }
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