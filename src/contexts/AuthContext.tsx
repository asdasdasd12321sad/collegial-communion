
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

type UserVerificationStatus = 'verified' | 'unverified';

interface User {
  id: string;
  email: string;
  displayName: string;
  verificationStatus: UserVerificationStatus;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setDisplayName: (name: string) => void;
  needsDisplayName: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// List of allowed college email domains for verification
const ALLOWED_DOMAINS = [
  'edu',
  'college.edu',
  'university.edu',
  'student.edu',
  // Add more college domains as needed
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsDisplayName, setNeedsDisplayName] = useState<boolean>(false);

  // Check for existing user session on mount
  useEffect(() => {
    // Simulate checking for an existing session
    const checkSession = () => {
      const storedUser = localStorage.getItem('cendyUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    // Add a slight delay to simulate network request
    setTimeout(checkSession, 800);
  }, []);

  // Helper to check if email domain is allowed for verification
  const isAllowedDomain = (email: string): boolean => {
    return ALLOWED_DOMAINS.some(domain => email.toLowerCase().endsWith(domain));
  };

  // Google login
  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate Google Auth
      // In a real app, this would be an actual Google Auth call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate a returned email and ID
      const mockEmail = 'student@college.edu';
      const mockUserId = 'google-' + Math.random().toString(36).substring(2, 10);
      
      if (isAllowedDomain(mockEmail)) {
        // Create a verified user without display name yet
        const newUser: User = {
          id: mockUserId,
          email: mockEmail,
          displayName: '',
          verificationStatus: 'verified',
        };
        
        setUser(newUser);
        setNeedsDisplayName(true);
      } else {
        toast({
          title: "Authentication Error",
          description: "Please log in with your student email address.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive",
      });
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Microsoft login
  const loginWithMicrosoft = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate Microsoft Auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate a returned email and ID
      const mockEmail = 'student@university.edu';
      const mockUserId = 'microsoft-' + Math.random().toString(36).substring(2, 10);
      
      if (isAllowedDomain(mockEmail)) {
        // Create a verified user without display name yet
        const newUser: User = {
          id: mockUserId,
          email: mockEmail,
          displayName: '',
          verificationStatus: 'verified',
        };
        
        setUser(newUser);
        setNeedsDisplayName(true);
      } else {
        toast({
          title: "Authentication Error",
          description: "Please log in with your student email address.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to login with Microsoft. Please try again.",
        variant: "destructive",
      });
      console.error("Microsoft login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apple login
  const loginWithApple = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate Apple Auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For Apple login, we always create unverified users
      const mockUserId = 'apple-' + Math.random().toString(36).substring(2, 10);
      const mockName = 'Apple User'; // In a real app, this would come from Apple
      
      const newUser: User = {
        id: mockUserId,
        email: 'private@apple.com', // Apple often provides private relay emails
        displayName: mockName,
        verificationStatus: 'unverified',
      };
      
      setUser(newUser);
      // Store user in localStorage
      localStorage.setItem('cendyUser', JSON.stringify(newUser));
      
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to login with Apple. Please try again.",
        variant: "destructive",
      });
      console.error("Apple login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Email login
  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate Email Auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate email and password
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // For email login, we always create unverified users
      const mockUserId = 'email-' + Math.random().toString(36).substring(2, 10);
      const randomName = 'User' + Math.floor(Math.random() * 10000);
      
      const newUser: User = {
        id: mockUserId,
        email: email,
        displayName: randomName,
        verificationStatus: 'unverified',
      };
      
      setUser(newUser);
      // Store user in localStorage
      localStorage.setItem('cendyUser', JSON.stringify(newUser));
      
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : "Failed to login. Please try again.",
        variant: "destructive",
      });
      console.error("Email login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set display name
  const setDisplayName = (name: string): void => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      displayName: name,
    };
    
    setUser(updatedUser);
    setNeedsDisplayName(false);
    
    // Store updated user in localStorage
    localStorage.setItem('cendyUser', JSON.stringify(updatedUser));
  };

  // Logout
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('cendyUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithGoogle,
        loginWithMicrosoft,
        loginWithApple,
        loginWithEmail,
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
