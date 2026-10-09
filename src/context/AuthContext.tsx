import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile;
  supabaseUser: User | null;
  session: Session | null;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  isRealSupabaseSession: boolean;
  setUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
    phone?: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateProfile: (updates: { name?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isOperatorOrResponder: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const DEMO_PERSONAS: Record<UserRole, UserProfile> = {
  passenger: {
    id: 'usr-passenger-1',
    email: 'sameer.passenger@railsafe.in',
    name: 'Sameer Khan',
    phone: '+919876543210',
    role: 'passenger',
    createdAt: '2026-01-10T10:00:00Z',
  },
  operator: {
    id: 'usr-operator-1',
    email: 'aditi.nair@irctc.gov.in',
    name: 'Aditi Nair',
    phone: '+919822110099',
    role: 'operator',
    badgeNumber: 'RPF-CTRL-884',
    department: 'Central Railway Safety & Threat Triage Control',
    createdAt: '2025-06-15T09:00:00Z',
  },
  responder: {
    id: 'usr-responder-1',
    email: 'vikram.singh@rpf.gov.in',
    name: 'SI Vikram Singh',
    phone: '+919833445566',
    role: 'responder',
    badgeNumber: 'RPF-BPL-412',
    department: 'Railway Protection Force (Bhopal Division)',
    createdAt: '2025-08-20T11:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('railsafe_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEMO_PERSONAS.passenger;
  });

  const isRealSupabaseSession = Boolean(supabaseUser && session);

  // Helper to fetch or create user profile from Supabase database
  const fetchSupabaseProfile = async (authId: string, email: string, userMeta?: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Profile fetch note:', error.message);
      }

      if (data) {
        const profile: UserProfile = {
          id: data.id,
          email: data.email || email,
          name: data.name || email.split('@')[0],
          phone: data.phone || userMeta?.phone || '',
          role: (data.role as UserRole) || 'passenger',
          badgeNumber: data.badge_number,
          department: data.department,
          avatarUrl: data.avatar_url,
          createdAt: data.created_at || new Date().toISOString(),
        };
        setUser(profile);
        localStorage.setItem('railsafe_user', JSON.stringify(profile));
        return profile;
      } else {
        // If profile doesn't exist yet, insert a default one
        const fallbackName = userMeta?.name || email.split('@')[0];
        const newProfile: UserProfile = {
          id: authId,
          email,
          name: fallbackName,
          phone: userMeta?.phone || '',
          role: 'passenger', // strictly passenger
          createdAt: new Date().toISOString(),
        };

        const { error: insertError } = await supabase.from('profiles').insert({
          id: authId,
          email,
          name: fallbackName,
          phone: userMeta?.phone || null,
          role: 'passenger',
        });

        if (insertError) {
          console.warn('Profile auto-insert note:', insertError.message);
        }

        setUser(newProfile);
        localStorage.setItem('railsafe_user', JSON.stringify(newProfile));
        return newProfile;
      }
    } catch (err) {
      console.error('Error fetching Supabase profile:', err);
      return null;
    }
  };

  // Listen to Supabase Auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setSupabaseUser(session?.user || null);

      if (session?.user) {
        fetchSupabaseProfile(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata
        ).finally(() => {
          if (isMounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // 2. Auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setSupabaseUser(newSession?.user || null);

        if (event === 'SIGNED_IN' && newSession?.user) {
          await fetchSupabaseProfile(
            newSession.user.id,
            newSession.user.email || '',
            newSession.user.user_metadata
          );
        } else if (event === 'SIGNED_OUT') {
          // Revert to demo passenger fallback on sign out
          setUser(DEMO_PERSONAS.passenger);
          localStorage.removeItem('railsafe_user');
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const switchRole = (role: UserRole) => {
    const persona = DEMO_PERSONAS[role];
    setUser(persona);
    localStorage.setItem('railsafe_user', JSON.stringify(persona));
  };

  const login = (email: string, role: UserRole = 'passenger') => {
    const persona = {
      ...DEMO_PERSONAS[role],
      email,
      name: email.split('@')[0].toUpperCase(),
    };
    setUser(persona);
    localStorage.setItem('railsafe_user', JSON.stringify(persona));
  };

  // Real Supabase sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // If Supabase is not yet configured, allow demo simulated login
      login(email, 'passenger');
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchSupabaseProfile(data.user.id, data.user.email || email, data.user.user_metadata);
        return { success: true };
      }

      return { success: false, error: 'Sign in completed without user data.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during sign in.' };
    }
  };

  // Real Supabase sign up with email and password
  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
    phone?: string
  ) => {
    if (!isSupabaseConfigured) {
      login(email, 'passenger');
      return { success: true, message: 'Account created (Demo Mode active).' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone ? phone.trim() : undefined,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // If email confirmation is enabled, session might be null until confirmed
        if (data.session) {
          await fetchSupabaseProfile(data.user.id, data.user.email || email, { name, phone });
          return { success: true, message: 'Registration successful! You are now logged in.' };
        } else {
          return {
            success: true,
            message: 'Registration successful! Please check your email to confirm your account, then sign in.',
          };
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during registration.' };
    }
  };

  // Update passenger profile (name and phone only; role changes strictly blocked by RLS)
  const updateProfile = async (updates: { name?: string; phone?: string }) => {
    try {
      if (isRealSupabaseSession && supabaseUser) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: updates.name?.trim(),
            phone: updates.phone?.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', supabaseUser.id);

        if (error) {
          return { success: false, error: error.message };
        }
      }

      const updatedUser: UserProfile = {
        ...user,
        name: updates.name ? updates.name.trim() : user.name,
        phone: updates.phone !== undefined ? updates.phone.trim() : user.phone,
      };
      setUser(updatedUser);
      localStorage.setItem('railsafe_user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update profile.' };
    }
  };

  // Real Supabase sign out
  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out warning:', err);
      }
    }
    setSupabaseUser(null);
    setSession(null);
    setUser(DEMO_PERSONAS.passenger);
    localStorage.removeItem('railsafe_user');
  };

  const isOperatorOrResponder = user.role === 'operator' || user.role === 'responder';

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        isLoading,
        isSupabaseConfigured,
        isRealSupabaseSession,
        setUser,
        switchRole,
        login,
        signInWithEmail,
        signUpWithEmail,
        updateProfile,
        logout,
        isOperatorOrResponder,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
