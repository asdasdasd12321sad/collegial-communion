import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

type UserVerificationStatus = 'verified' | 'unverified';

interface User {
  id: string;
  email: string;
  displayName: string;
  verificationStatus: UserVerificationStatus;
  university: string | null;
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

  // Google login
  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate Google Auth
      // In a real app, this would be an actual Google Auth call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate a returned email and ID
      const mockEmail = 'student@harvard.edu';
      const mockUserId = 'google-' + Math.random().toString(36).substring(2, 10);
      
      if (isAllowedDomain(mockEmail)) {
        // Detect university from email
        const university = extractUniversityFromEmail(mockEmail);
        
        // Create a verified user without display name yet
        const newUser: User = {
          id: mockUserId,
          email: mockEmail,
          displayName: '',
          verificationStatus: 'verified',
          university: university || 'Unknown University'
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
      const mockEmail = 'student@stanford.edu';
      const mockUserId = 'microsoft-' + Math.random().toString(36).substring(2, 10);
      
      if (isAllowedDomain(mockEmail)) {
        // Detect university from email
        const university = extractUniversityFromEmail(mockEmail);
        
        // Create a verified user without display name yet
        const newUser: User = {
          id: mockUserId,
          email: mockEmail,
          displayName: '',
          verificationStatus: 'verified',
          university: university || 'Unknown University'
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
        university: null
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
      
      // Check if it's a university email
      const isUniversityEmail = isAllowedDomain(email);
      
      // For email login, verify status based on email domain
      const mockUserId = 'email-' + Math.random().toString(36).substring(2, 10);
      const randomName = 'User' + Math.floor(Math.random() * 10000);
      
      // Detect university from email if it's a university email
      const university = isUniversityEmail ? extractUniversityFromEmail(email) : null;
      
      const newUser: User = {
        id: mockUserId,
        email: email,
        displayName: randomName,
        verificationStatus: isUniversityEmail ? 'verified' : 'unverified',
        university: university
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
