
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
  uploadProfileImage: (file: File) => Promise<string>;
  deleteProfileImage: (url: string) => Promise<void>;
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
  uploadProfileImage: async () => "",
  deleteProfileImage: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (data) {
        return {
          id: data.id,
          email: data.login_email,
          displayName: data.display_name,
          fullName: data.full_name,
          verificationStatus: data.verification_status as UserVerificationStatus,
          university: data.university,
          bio: data.bio,
          profilePictureUrl: data.profile_picture_url,
          createdAt: data.created_at,
          authProvider: data.auth_provider as AuthProvider,
          lastLogin: data.last_login,
          images: data.images || []
        } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        
        if (newSession?.user) {
          const profile = await fetchUserProfile(newSession.user.id);
          setUser(profile || {
            id: newSession.user.id,
            email: newSession.user.email,
          } as User);
          
          // Check if user needs to set display name
          if (event === 'SIGNED_IN' && profile) {
            if (!profile.displayName) {
              navigate('/set-display-name');
            } else {
              // If user already has a display name, redirect to home
              navigate('/home');
            }
          }
        } else {
          setUser(null);
        }

        // Auto-redirect to login on signOut
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        const profile = await fetchUserProfile(currentSession.user.id);
        setUser(profile || {
          id: currentSession.user.id,
          email: currentSession.user.email,
        } as User);
        
        // Check if user needs to set display name
        if (profile) {
          if (!profile.displayName) {
            navigate('/set-display-name');
          }
        }
      } else {
        setUser(null);
      }
      
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
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
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
        options: {
          scopes: 'email profile openid',
        },
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
      const updateData: any = {};
      
      if (updates.displayName !== undefined) updateData.display_name = updates.displayName;
      if (updates.bio !== undefined) updateData.bio = updates.bio;
      if (updates.university !== undefined) updateData.university = updates.university;
      if (updates.profilePictureUrl !== undefined) updateData.profile_picture_url = updates.profilePictureUrl;
      if (updates.images !== undefined) updateData.images = updates.images;
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
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
    console.log("Setting display name:", displayName);
    return updateUserProfile({ displayName });
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    if (!user) {
      toast({
        title: "Upload Failed",
        description: "You must be logged in to upload images.",
        variant: "destructive",
      });
      return "";
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      // Update user's profile with the new image URL
      let currentImages = user.images || [];
      if (Array.isArray(currentImages)) {
        currentImages = [...currentImages, publicUrl];
      } else {
        currentImages = [publicUrl];
      }

      await updateUserProfile({ 
        images: currentImages,
        // Update profile picture if user doesn't have one yet
        ...(user.profilePictureUrl ? {} : { profilePictureUrl: publicUrl })
      });

      toast({
        title: "Image Uploaded",
        description: "Your image has been successfully uploaded.",
      });

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Could not upload image. Please try again.",
        variant: "destructive",
      });
      return "";
    }
  };

  const deleteProfileImage = async (url: string) => {
    if (!user) {
      toast({
        title: "Delete Failed",
        description: "You must be logged in to delete images.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract the file path from the URL
      const baseUrl = supabase.storage.from('profile_images').getPublicUrl('').data.publicUrl;
      const filePath = url.replace(baseUrl, '');

      // Delete the file from storage
      const { error: deleteError } = await supabase.storage
        .from('profile_images')
        .remove([filePath]);

      if (deleteError) {
        throw deleteError;
      }

      // Update user's images array by removing the deleted image
      let currentImages = user.images || [];
      if (Array.isArray(currentImages)) {
        currentImages = currentImages.filter(img => img !== url);
      }

      // If the deleted image was the profile picture, update it
      let profilePictureUpdate = {};
      if (user.profilePictureUrl === url) {
        profilePictureUpdate = { 
          profilePictureUrl: currentImages.length > 0 ? currentImages[0] : null 
        };
      }

      await updateUserProfile({ 
        images: currentImages,
        ...profilePictureUpdate
      });

      toast({
        title: "Image Deleted",
        description: "Your image has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Could not delete image. Please try again.",
        variant: "destructive",
      });
    }
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
        uploadProfileImage,
        deleteProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
