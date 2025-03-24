
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Using interface instead of import to fix "not a module" error
interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  setDisplayName: (displayName: string) => Promise<void>;
}

// Create context with a default empty implementation
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isLoading: true,
  login: async () => {},
  loginWithEmail: async () => {},
  loginWithGoogle: async () => {},
  loginWithMicrosoft: async () => {},
  loginWithApple: async () => {},
  signUp: async () => {},
  signUpWithEmail: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  setDisplayName: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ? {
          id: newSession.user.id,
          email: newSession.user.email,
          // Map other user properties as needed
        } as User : null);

        // Auto-redirect to login on signOut
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ? {
        id: currentSession.user.id,
        email: currentSession.user.email,
        // Map other user properties as needed
      } as User : null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      navigate('/home');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Could not sign in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const login = loginWithEmail; // Alias for loginWithEmail

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Google Login Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Microsoft Login Failed",
        description: error.message || "Could not sign in with Microsoft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loginWithApple = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Apple Login Failed",
        description: error.message || "Could not sign in with Apple. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account Created",
        description: "Please check your email to confirm your account.",
      });
      
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account Created",
        description: "Please check your email to confirm your account.",
      });
      
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Navigation to login is handled by the onAuthStateChange listener
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) {
      toast({
        title: "Update Failed",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: updates.displayName,
          bio: updates.bio,
          university: updates.university,
          // Add other fields as needed
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setUser({ ...user, ...updates });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const setDisplayName = async (displayName: string) => {
    return updateUserProfile({ displayName });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoading: loading,
        login,
        loginWithEmail,
        loginWithGoogle,
        loginWithMicrosoft,
        loginWithApple,
        signUp,
        signUpWithEmail,
        logout,
        updateUserProfile,
        setDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
