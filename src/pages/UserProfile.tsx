import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Settings, Edit, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(user?.bio || '');
  
  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);
  
  const handleEditBio = () => {
    setIsEditingBio(true);
  };
  
  const handleSaveBio = async () => {
    try {
      await updateUserProfile({ bio: newBio });
      setIsEditingBio(false);
      toast({
        title: "Bio Updated",
        description: "Your bio has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating bio:", error);
      toast({
        title: "Error",
        description: "Failed to update bio. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCancelEditBio = () => {
    setNewBio(user?.bio || '');
    setIsEditingBio(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  
  const profileHeader = () => (
    <div className="relative z-10 mt-2 flex flex-col items-center justify-center px-4 pb-5 pt-0">
      <div className="relative mt-[-3rem] h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-cendy-gray-light shadow-md">
        {user?.profilePictureUrl ? (
          <img
            src={user.profilePictureUrl}
            alt={user.displayName || "User"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cendy-blue text-2xl font-bold text-white">
            {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
          </div>
        )}
      </div>
      
      <h1 className="mt-2 text-xl font-semibold text-cendy-text">{user?.displayName || 'User'}</h1>
      <h2 className="text-sm text-cendy-text-secondary">{user?.university || 'No University'}</h2>
    </div>
  );
  
  const profileActions = () => (
    <div className="flex items-center justify-end gap-2 px-4">
      {user?.id === userId ? (
        <a href="/settings" className="rounded-xl bg-cendy-blue px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-cendy-blue-dark focus:outline-none focus:ring-2 focus:ring-cendy-blue focus:ring-opacity-50">
          <Settings size={16} className="inline-block align-middle mr-1" />
          <span>Settings</span>
        </a>
      ) : (
        <button className="rounded-xl bg-cendy-blue px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-cendy-blue-dark focus:outline-none focus:ring-2 focus:ring-cendy-blue focus:ring-opacity-50">
          Message
        </button>
      )}
    </div>
  );
  
  const profileBio = () => (
    <div className="bg-white rounded-2xl shadow-sm p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-cendy-text">About Me</h3>
        {user?.id === userId && !isEditingBio && (
          <button onClick={handleEditBio} className="text-cendy-blue hover:text-cendy-blue-dark">
            <Edit size={16} className="inline-block align-middle mr-1" />
            Edit
          </button>
        )}
      </div>
      
      {isEditingBio ? (
        <div className="space-y-2">
          <textarea
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            className="w-full rounded-xl border border-cendy-gray-medium px-4 py-3 focus:border-cendy-blue focus:outline-none focus:ring-1 focus:ring-cendy-blue"
            placeholder="Write something about yourself..."
          />
          <div className="flex justify-end gap-2">
            <button onClick={handleCancelEditBio} className="rounded-xl bg-cendy-gray-light px-4 py-2 text-sm font-medium text-cendy-text-secondary transition-all duration-300 hover:bg-cendy-gray-medium focus:outline-none focus:ring-2 focus:ring-cendy-blue focus:ring-opacity-50">
              Cancel
            </button>
            <button onClick={handleSaveBio} className="rounded-xl bg-cendy-blue px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-cendy-blue-dark focus:outline-none focus:ring-2 focus:ring-cendy-blue focus:ring-opacity-50">
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-cendy-text-secondary">
          {user?.bio || 'No bio yet.'}
        </p>
      )}
    </div>
  );
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header title="Profile" centerTitle={true} />
      
      <div className="relative">
        <div className="bg-cendy-blue h-32"></div>
        {profileHeader()}
        {profileActions()}
      </div>
      
      <main className="flex-1 p-4">
        {profileBio()}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default UserProfile;
