
import React from 'react';
import { ArrowLeft, MessageCircle, Calendar, School, MapPin, Bookmark } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from "@/components/ui/separator";
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
        <div className="bg-white px-4 pt-4 pb-6">
          <div className="flex items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cendy-blue text-xl font-medium text-white">
              {profileUser.displayName[0]}
            </div>
            
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
            </div>
            
            <button
              onClick={handleMessageClick}
              className="flex items-center justify-center rounded-full bg-cendy-blue px-4 py-2 text-sm font-medium text-white hover:bg-cendy-blue/90"
            >
              <MessageCircle size={16} className="mr-1" />
              Message
            </button>
          </div>
          
          {/* Bio */}
          {profileUser.bio && (
            <div className="mt-4">
              <p className="text-sm text-cendy-text">{profileUser.bio}</p>
            </div>
          )}
          
          {/* Interests */}
          {profileUser.interests && profileUser.interests.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {profileUser.interests.map((interest, index) => (
                <div 
                  key={index} 
                  className="rounded-full bg-cendy-gray-medium px-3 py-1 text-xs font-medium text-cendy-text"
                >
                  {interest}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Photos Section */}
        {profileUser.photos && profileUser.photos.length > 0 && (
          <div className="bg-white px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-cendy-text">Photos</h2>
              <button className="text-cendy-blue text-sm">See all</button>
            </div>
            
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
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
