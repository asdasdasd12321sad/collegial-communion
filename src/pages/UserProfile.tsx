
import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Calendar, School, User, ImageIcon, BookmarkIcon, Heart } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';

// Sample user data - in a real app, this would come from an API
const SAMPLE_USERS = [
  {
    id: '1',
    displayName: 'Alex Thompson',
    university: 'Harvard University',
    bio: 'Computer Science major. Coffee enthusiast. Always coding something new!',
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 year ago
    photos: [
      "https://images.unsplash.com/photo-1472213984618-c79aaec300c1",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
    ],
    interests: ['Coding', 'Coffee', 'Gaming', 'Hiking']
  },
  {
    id: '2',
    displayName: 'Jamie Wilson',
    university: 'Stanford University',
    bio: 'Biology major. Love hiking and nature photography.',
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(), // 6 months ago
    photos: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b"
    ],
    interests: ['Biology', 'Photography', 'Hiking', 'Reading']
  },
  {
    id: '3',
    displayName: 'Riley Evans',
    university: 'MIT',
    bio: 'Computer Engineering student. Passionate about AI and machine learning.',
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), // 3 months ago
    photos: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
    ],
    interests: ['AI', 'Machine Learning', 'Robotics', 'Reading']
  }
];

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [activeTab, setActiveTab] = useState("photos");
  
  // Find user by ID
  const profileUser = SAMPLE_USERS.find(u => u.id === userId) || SAMPLE_USERS[0];
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleMessageClick = () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can send messages.",
        variant: "default",
      });
      return;
    }
    
    toast({
      title: "Start Conversation",
      description: `Starting conversation with ${profileUser.displayName}`,
    });
    
    // Navigate to messages screen (in a real app, this would go to a specific chat)
    navigate('/messages');
  };
  
  // Format the join date
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Empty states
  const EmptyPhotos = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-cendy-gray p-3 mb-3">
        <ImageIcon size={24} className="text-cendy-text-secondary" />
      </div>
      <h3 className="text-lg font-medium mb-1">No Photos Yet</h3>
      <p className="text-sm text-cendy-text-secondary max-w-xs">
        {profileUser.displayName} hasn't uploaded any photos yet.
      </p>
    </div>
  );
  
  const EmptyInterests = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-cendy-gray p-3 mb-3">
        <Heart size={24} className="text-cendy-text-secondary" />
      </div>
      <h3 className="text-lg font-medium mb-1">No Interests Added</h3>
      <p className="text-sm text-cendy-text-secondary max-w-xs">
        {profileUser.displayName} hasn't added any interests yet.
      </p>
    </div>
  );
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header 
        title="Profile" 
        centerTitle
        leftElement={
          <button onClick={handleBackClick} className="flex items-center text-cendy-text">
            <ArrowLeft size={20} />
          </button>
        }
      />
      
      <main className="flex-1">
        {/* Profile Header */}
        <div className="bg-white px-4 pt-6 pb-6">
          <div className="flex items-start">
            <Avatar className="h-20 w-20 bg-cendy-blue text-white text-xl">
              <AvatarFallback>
                {profileUser.displayName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="ml-4 flex-1">
              <h1 className="text-xl font-bold text-cendy-text">{profileUser.displayName}</h1>
              
              <div className="flex items-center mt-1">
                <School size={16} className="text-cendy-text-secondary mr-1" />
                <p className="text-sm text-cendy-text-secondary">{profileUser.university}</p>
              </div>
              
              <div className="flex items-center mt-1">
                <Calendar size={16} className="text-cendy-text-secondary mr-1" />
                <p className="text-sm text-cendy-text-secondary">Joined {formatJoinDate(profileUser.joinedAt)}</p>
              </div>
              
              <button
                onClick={handleMessageClick}
                className="mt-3 flex items-center justify-center rounded-full bg-cendy-blue px-4 py-2 text-sm font-medium text-white hover:bg-cendy-blue/90"
              >
                <MessageCircle size={16} className="mr-1" />
                Message
              </button>
            </div>
          </div>
          
          {/* Bio */}
          {profileUser.bio && (
            <div className="mt-4">
              <p className="text-sm text-cendy-text">{profileUser.bio}</p>
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Tabs Section */}
        <div className="bg-white">
          <Tabs defaultValue="photos" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-cendy-gray-medium/20">
              <TabsTrigger value="photos" className="data-[state=active]:bg-white">
                Photos
              </TabsTrigger>
              <TabsTrigger value="interests" className="data-[state=active]:bg-white">
                Interests
              </TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-white">
                About
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="photos" className="p-4">
              {profileUser.photos && profileUser.photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {profileUser.photos.map((photo, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md">
                      <img 
                        src={photo} 
                        alt={`${profileUser.displayName}'s photo ${index + 1}`} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyPhotos />
              )}
            </TabsContent>
            
            <TabsContent value="interests" className="p-4">
              {profileUser.interests && profileUser.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileUser.interests.map((interest, index) => (
                    <div 
                      key={index} 
                      className="rounded-full bg-cendy-gray-medium/30 px-3 py-1.5 text-sm font-medium text-cendy-text"
                    >
                      {interest}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyInterests />
              )}
            </TabsContent>
            
            <TabsContent value="about" className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-cendy-text-secondary mb-1">Display Name</h3>
                  <p className="text-base text-cendy-text">{profileUser.displayName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-cendy-text-secondary mb-1">University</h3>
                  <p className="text-base text-cendy-text">{profileUser.university}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-cendy-text-secondary mb-1">Member Since</h3>
                  <p className="text-base text-cendy-text">{formatJoinDate(profileUser.joinedAt)}</p>
                </div>
                
                {profileUser.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-cendy-text-secondary mb-1">Bio</h3>
                    <p className="text-base text-cendy-text">{profileUser.bio}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
