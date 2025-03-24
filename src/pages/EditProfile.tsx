
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Camera, Loader2, X, ChevronLeft, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const EditProfile: React.FC = () => {
  const { user, updateUserProfile, uploadProfileImage, deleteProfileImage } = useAuth();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [university, setUniversity] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
      setUniversity(user.university || '');
      setPhotoUrls(user.images || []);
      setProfilePicture(user.profilePictureUrl || '');
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const file = files[0];
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image under 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      const url = await uploadProfileImage(file);
      if (url) {
        setPhotoUrls([...photoUrls, url]);
        
        // If no profile picture is set, use this as the profile picture
        if (!profilePicture) {
          setProfilePicture(url);
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (url: string) => {
    try {
      await deleteProfileImage(url);
      
      // Update local state
      const newPhotoUrls = photoUrls.filter(photoUrl => photoUrl !== url);
      setPhotoUrls(newPhotoUrls);
      
      // If the deleted photo was the profile picture, update it
      if (profilePicture === url) {
        const newProfilePicture = newPhotoUrls.length > 0 ? newPhotoUrls[0] : '';
        setProfilePicture(newProfilePicture);
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleSetProfilePicture = (url: string) => {
    setProfilePicture(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateUserProfile({
        displayName,
        bio,
        university,
        profilePictureUrl: profilePicture,
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      navigate('/settings');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header 
        title="Edit Profile" 
        centerTitle={true} 
        leftIcon={<ChevronLeft size={24} onClick={() => navigate('/settings')} />}
        rightIcon={
          isSubmitting ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Check 
              size={24} 
              className="text-cendy-blue" 
              onClick={handleSubmit} 
            />
          )
        }
      />

      <form onSubmit={handleSubmit} className="flex-1 p-4">
        <div className="mb-6 flex flex-col items-center">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            {profilePicture ? (
              <AvatarImage src={profilePicture} alt={displayName} />
            ) : (
              <AvatarFallback className="bg-cendy-blue text-2xl text-white">
                {displayName?.[0] || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          
          <label className="mt-2 cursor-pointer rounded-xl bg-cendy-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cendy-blue-dark">
            <span className="flex items-center gap-1">
              <Camera size={16} />
              {isUploading ? 'Uploading...' : 'Add Photo'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
          <div>
            <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-cendy-text">
              Display Name
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              maxLength={20}
              className="w-full"
            />
            <p className="mt-1 text-xs text-cendy-text-secondary">
              This is how others will see you (3-20 characters)
            </p>
          </div>

          <div>
            <label htmlFor="university" className="mb-1 block text-sm font-medium text-cendy-text">
              University
            </label>
            <Input
              id="university"
              value={university || ''}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Your university"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="bio" className="mb-1 block text-sm font-medium text-cendy-text">
              Bio
            </label>
            <Textarea
              id="bio"
              value={bio || ''}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself"
              className="min-h-[100px] w-full"
              maxLength={250}
            />
            <p className="mt-1 text-xs text-cendy-text-secondary">
              {(bio?.length || 0)}/250 characters
            </p>
          </div>
        </div>

        {photoUrls.length > 0 && (
          <div className="mt-4 space-y-4 rounded-xl bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-cendy-text">My Photos</h3>
            <div className="grid grid-cols-3 gap-2">
              {photoUrls.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className={`h-full w-full rounded-lg object-cover ${profilePicture === url ? 'ring-2 ring-cendy-blue' : ''}`}
                    onClick={() => handleSetProfilePicture(url)}
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded-full bg-black bg-opacity-50 p-1 text-white"
                    onClick={() => handleDeletePhoto(url)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-cendy-text-secondary">
              Tap an image to set it as your profile picture
            </p>
          </div>
        )}
      </form>

      <BottomNavigation />
    </div>
  );
};

export default EditProfile;
