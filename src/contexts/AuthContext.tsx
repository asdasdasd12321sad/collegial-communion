
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Session, User, Provider } from '@supabase/supabase-js';
import { supabase, isAllowedDomain, extractUniversityFromEmail } from '@/config/supabase';

// Create a User type that matches what we expect in the app
export interface AppUser extends User {
  displayName?: string;
  verificationStatus?: 'verified' | 'unverified';
  university?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  profile: any;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setDisplayName: (name: string) => Promise<void>;
  needsDisplayName: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsDisplayName, setNeedsDisplayName] = useState<boolean>(false);

  // Set up authentication state listeners
  useEffect(() => {
    setIsLoading(true);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setSession(session);
          
          // Create an enhanced user object with our additional properties
          const enhancedUser: AppUser = {
            ...session.user,
            displayName: profile?.display_name || 'User',
            verificationStatus: 
              session.user.email && isAllowedDomain(session.user.email) 
                ? 'verified' 
                : 'unverified',
            university: profile?.university || 
              (session.user.email ? extractUniversityFromEmail(session.user.email) : null)
          };
          
          setUser(enhancedUser);
          
          if (session.user) {
            await fetchUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setSession(null);
        }
      }
    );

    // Check for existing Supabase session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setSession(session);
        
        if (session.user) {
          await fetchUserProfile(session.user.id);
          
          // Create an enhanced user object with our additional properties
          const enhancedUser: AppUser = {
            ...session.user,
            displayName: profile?.display_name || 'User',
            verificationStatus: 
              session.user.email && isAllowedDomain(session.user.email) 
                ? 'verified' 
                : 'unverified',
            university: profile?.university || 
              (session.user.email ? extractUniversityFromEmail(session.user.email) : null)
          };
          
          setUser(enhancedUser);
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update user properties when profile changes
  useEffect(() => {
    if (user && profile) {
      setUser({
        ...user,
        displayName: profile.display_name || 'User',
        university: profile.university || 
          (user.email ? extractUniversityFromEmail(user.email) : null)
      });
      
      setNeedsDisplayName(!profile.display_name || profile.display_name === 'User');
    }
  }, [profile]);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
        setNeedsDisplayName(!data.display_name || data.display_name === 'User');
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Google login
  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/home'
        }
      });
      
      if (error) throw error;
      
      // Success will redirect to the OAuth provider
      // and then back to the app
      
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Microsoft login
  const loginWithMicrosoft = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: window.location.origin + '/home'
        }
      });
      
      if (error) throw error;
      
      // Success will redirect to the OAuth provider
      // and then back to the app
      
    } catch (error: any) {
      console.error("Microsoft login error:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to login with Microsoft. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Apple login
  const loginWithApple = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin + '/home'
        }
      });
      
      if (error) throw error;
      
      // Success will redirect to the OAuth provider
      // and then back to the app
      
    } catch (error: any) {
      console.error("Apple login error:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to login with Apple. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Email login
  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Validate email and password
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Sign in with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
      
    } catch (error: any) {
      console.error("Email login error:", error);
      
      let errorMessage = "Failed to login. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  // Email signup
  const signUpWithEmail = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Validate email and password
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      // Check if the email is from an allowed domain for verification
      const isVerified = isAllowedDomain(email);
      
      // Create user with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: 'User',
            verification_status: isVerified ? 'verified' : 'unverified',
            university: extractUniversityFromEmail(email)
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Sign Up Successful",
        description: isVerified 
          ? "Your account has been created and verified." 
          : "Your account has been created, but you need to verify your student status.",
      });
      
    } catch (error: any) {
      console.error("Email signup error:", error);
      
      let errorMessage = "Failed to sign up. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Sign Up Error",
        description: errorMessage,
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  // Set display name
  const setDisplayName = async (name: string): Promise<void> => {
    if (!user) return;
    
    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: name, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setProfile(prev => ({ ...prev, display_name: name }));
      setUser(prev => prev ? { ...prev, displayName: name } : null);
      setNeedsDisplayName(false);
      
      toast({
        title: "Profile Updated",
        description: "Your display name has been updated.",
      });
      
    } catch (error) {
      console.error("Error updating display name:", error);
      toast({
        title: "Update Error",
        description: "Failed to update display name. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        loginWithGoogle,
        loginWithMicrosoft,
        loginWithApple,
        loginWithEmail,
        signUpWithEmail,
        logout,
        setDisplayName,
        needsDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
