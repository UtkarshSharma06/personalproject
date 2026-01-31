import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ data: any; error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  mfa: {
    enroll: () => Promise<{ data: any; error: any }>;
    challengeAndVerify: (factorId: string, code: string) => Promise<{ error: any }>;
    unenroll: (factorId: string) => Promise<{ error: any }>;
    listFactors: () => Promise<{ data: any; error: any }>;
    getAAL: () => Promise<{ data: any; error: any }>;
  };
  aal: string | null;
  hasMFA: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [aal, setAal] = useState<string | null>(null);
  const [hasMFA, setHasMFA] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchProfile(session.user.id);
          updateAALStatus();
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Initial check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
        await updateAALStatus();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data) {
        if ((data as any).is_banned) {
          await supabase.auth.signOut();
          setProfile(null);
          setUser(null);
          setSession(null);
          window.location.href = '/auth?banned=true';
          return;
        }

        // Auto-sync Google avatar if missing
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const googleAvatar = authUser?.user_metadata?.avatar_url;
        if (!data.avatar_url && googleAvatar) {
          await supabase.from('profiles').update({ avatar_url: googleAvatar }).eq('id', userId);
          data.avatar_url = googleAvatar;
        }

        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Realtime Profile Updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload: any) => {
          if (payload.new?.is_banned) {
            supabase.auth.signOut().then(() => {
              setProfile(null);
              setUser(null);
              setSession(null);
              window.location.href = '/auth?banned=true';
            });
          } else {
            setProfile(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const updateAALStatus = async () => {
    const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const { data: factorsData } = await supabase.auth.mfa.listFactors();

    setAal(aalData?.currentLevel ?? null);
    setHasMFA(factorsData?.all?.some(f => f.status === 'verified') ?? false);
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
        },
      },
    });

    return { data, error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
  };

  const signInWithGoogle = async (redirectTo?: string) => {
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      try {
        const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
        const googleUser = await GoogleAuth.signIn();

        if (googleUser && googleUser.authentication.idToken) {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: googleUser.authentication.idToken,
          });
          if (!error) return { error: null };
          console.error("Native Token Sign-In failed:", error);
        }
      } catch (err: any) {
        console.warn("Native Google Auth Error/Cancelled, trying browser flow:", err);
        if (err.message?.includes("cancelled") || err.code === "CANCELLED") {
          return { error: null };
        }
      }
    }

    // Web Browser Flow (or Fallback for Native)
    const finalRedirect = isNative ? 'com.italostudy.app://google-auth' : (redirectTo || `${window.location.origin}/dashboard`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: finalRedirect,
        skipBrowserRedirect: false
      }
    });

    return { error: error as Error | null };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error as Error | null };
  };

  const mfa = {
    enroll: async () => {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });
      return { data, error };
    },
    challengeAndVerify: async (factorId: string, code: string) => {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId
      });
      if (challengeError) return { error: challengeError };

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code
      });
      return { error: verifyError };
    },
    unenroll: async (factorId: string) => {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId
      });
      return { error };
    },
    listFactors: async () => {
      const { data, error } = await supabase.auth.mfa.listFactors();
      return { data, error };
    },
    getAAL: async () => {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      return { data, error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile: () => fetchProfile(user?.id ?? ''),
      signInWithGoogle,
      resetPassword,
      mfa,
      aal,
      hasMFA
    }}>
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
