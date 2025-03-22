
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// List of allowed college email domains for verification
const ALLOWED_DOMAINS = [
  'edu',
  'college.edu',
  'university.edu',
  'student.edu',
  // Add more college domains as needed
];

interface AuthContextType {
  user: User | null;
  profile: any;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setDisplayName: (name: string) => void;
  needsDisplayName: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsDisplayName, setNeedsDisplayName] = useState<boolean>(false);

  // Helper to check if email domain is allowed for verification
  const isAllowedDomain = (email: string): boolean => {
    return ALLOWED_DOMAINS.some(domain => email.toLowerCase().endsWith(domain));
  };

  // Helper to extract university from email
  const extractUniversityFromEmail = (email: string): string | null => {
    // Extract the domain from the email
    const domainMatch = email.match(/@([^.]+)/);
    if (!domainMatch) return null;
    
    const domain = domainMatch[1].toLowerCase();
    
    // Map domain to university name (simplified example)
    const universityMap: Record<string, string> = {
      'harvard': 'Harvard University',
      'stanford': 'Stanford University',
      'mit': 'MIT',
      'princeton': 'Princeton University',
      'berkeley': 'UC Berkeley',
      'yale': 'Yale University',
      'columbia': 'Columbia University',
      'cornell': 'Cornell University',
      'upenn': 'UPenn',
      'college': 'Sample College',
      'university': 'Sample University',
      'student': 'Sample School'
    };
    
    return universityMap[domain] || 'Unknown University';
  };

  // Set up authentication state listeners
  useEffect(() => {
    setIsLoading(true);

    // Firebase auth state listener
    const unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Sign in to Supabase with custom token
          const { email, uid, displayName } = firebaseUser;
          
          // Get a custom token from Firebase user
          const idToken = await firebaseUser.getIdToken();
          
          // Sign in to Supabase with custom token
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
          });
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setSession(data.session);
            setUser(data.user);
            
            // Fetch user profile
            if (data.user) {
              fetchUserProfile(data.user.id);
            }
          }
        } catch (error) {
          console.error("Error syncing Firebase auth with Supabase:", error);
          toast({
            title: "Authentication Error",
            description: "There was an issue with your account. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        // User is signed out of Firebase
        setUser(null);
        setProfile(null);
        setSession(null);
      }
      
      setIsLoading(false);
    });

    // Supabase auth state listener as backup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user);
          if (session.user) {
            fetchUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setSession(null);
        }
      }
    );

    // Check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        if (session.user) {
          fetchUserProfile(session.user.id);
        }
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribeFirebase();
      subscription.unsubscribe();
    };
  }, []);

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
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // The signed-in user info
      const firebaseUser = result.user;
      
      if (!firebaseUser.email || !isAllowedDomain(firebaseUser.email)) {
        // If not a valid educational email, sign out and show error
        await firebaseSignOut(auth);
        
        toast({
          title: "Authentication Error",
          description: "Please log in with your student email address.",
          variant: "destructive",
        });
        
        setIsLoading(false);
        return;
      }
      
      // If we got here, the user authenticated successfully with a valid email
      toast({
        title: "Authentication Successful",
        description: "You have successfully logged in.",
      });
      
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Microsoft login
  const loginWithMicrosoft = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const provider = new OAuthProvider('microsoft.com');
      const result = await signInWithPopup(auth, provider);
      
      // The signed-in user info
      const firebaseUser = result.user;
      
      if (!firebaseUser.email || !isAllowedDomain(firebaseUser.email)) {
        // If not a valid educational email, sign out and show error
        await firebaseSignOut(auth);
        
        toast({
          title: "Authentication Error",
          description: "Please log in with your student email address.",
          variant: "destructive",
        });
        
        setIsLoading(false);
        return;
      }
      
      // If we got here, the user authenticated successfully with a valid email
      toast({
        title: "Authentication Successful",
        description: "You have successfully logged in.",
      });
      
    } catch (error) {
      console.error("Microsoft login error:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to login with Microsoft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apple login
  const loginWithApple = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      
      // For Apple login, we don't verify email domains because Apple often uses private relay
      toast({
        title: "Authentication Successful",
        description: "You have successfully logged in with Apple.",
      });
      
    } catch (error) {
      console.error("Apple login error:", error);
      toast({
        title: "Authentication Error",
        description: "Failed to login with Apple. Please try again.",
        variant: "destructive",
      });
    } finally {
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
      
      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
      
    } catch (error: any) {
      console.error("Email login error:", error);
      
      let errorMessage = "Failed to login. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (error.message) {
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
      
      // Create user with Firebase
      await createUserWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Sign Up Successful",
        description: isVerified 
          ? "Your account has been created and verified." 
          : "Your account has been created, but you need to verify your student status.",
      });
      
      // User will be automatically logged in by Firebase's onAuthStateChanged
      
    } catch (error: any) {
      console.error("Email signup error:", error);
      
      let errorMessage = "Failed to sign up. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Please log in or use a different email.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.message) {
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
  const logout = async (): void => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
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
