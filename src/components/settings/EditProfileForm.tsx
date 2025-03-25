
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const EditProfileForm = () => {
  const { user, updateUserProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    university: user?.university || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate display name
    if (!formData.displayName.trim()) {
      toast({
        title: "Display name required",
        description: "Please enter a display name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await updateUserProfile({
        displayName: formData.displayName,
        bio: formData.bio,
        university: formData.university,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium text-cendy-text">
          Display Name
        </label>
        <Input
          id="displayName"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          className="border-cendy-gray-medium"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium text-cendy-text">
          Bio
        </label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ''}
          onChange={handleChange}
          className="min-h-[100px] border-cendy-gray-medium"
          placeholder="Tell others about yourself..."
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="university" className="text-sm font-medium text-cendy-text">
          University
        </label>
        <Input
          id="university"
          name="university"
          value={formData.university || ''}
          onChange={handleChange}
          className="border-cendy-gray-medium"
          placeholder="Your university"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-cendy-blue hover:bg-cendy-blue-dark text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
};

export default EditProfileForm;
