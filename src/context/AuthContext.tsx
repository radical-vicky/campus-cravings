import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  student_id: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  meal_plan_balance: number;
  meal_plan_type: string;
  dietary_preferences: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, studentId: string) => Promise<{ error: Error | null }>;
  signInWithSSO: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: error.message,
      });
      return { error };
    }
    
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string, studentId: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          student_id: studentId,
        },
      },
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        toast({
          variant: 'destructive',
          title: 'Account exists',
          description: 'An account with this email already exists. Please sign in instead.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Sign up failed',
          description: error.message,
        });
      }
      return { error };
    }
    
    toast({
      title: 'Account created!',
      description: 'Welcome to UniOrder. You can now start ordering.',
    });
    
    return { error: null };
  };

  // Simulated SSO - in production this would redirect to university OAuth
  const signInWithSSO = async () => {
    toast({
      title: 'University SSO',
      description: 'Simulating university single sign-on...',
    });
    
    // Simulate SSO by signing in with demo credentials
    const demoEmail = 'student@university.edu';
    const demoPassword = 'demo123456';
    
    // First try to sign up (if user doesn't exist)
    const { error: signUpError } = await supabase.auth.signUp({
      email: demoEmail,
      password: demoPassword,
      options: {
        data: {
          full_name: 'Demo Student',
          student_id: 'STU-2024-001',
        },
      },
    });
    
    // Then sign in
    const { error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });
    
    if (error && !signUpError) {
      toast({
        variant: 'destructive',
        title: 'SSO failed',
        description: error.message,
      });
      return { error };
    }
    
    toast({
      title: 'SSO Successful',
      description: 'Welcome back, Demo Student!',
    });
    
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error.message,
      });
      return { error };
    }

    // Refresh profile
    await fetchProfile(user.id);
    
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    });
    
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signInWithSSO,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
