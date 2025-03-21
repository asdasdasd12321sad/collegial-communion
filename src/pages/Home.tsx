
import React, { useState } from 'react';
import { Hash, Globe, MessageSquareText, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import ChannelCard from '@/components/home/ChannelCard';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  
  const [channels] = useState([
    {
      id: 'confession',
      title: 'Confession',
      description: 'Share anonymously with other students',
      icon: <Hash size={28} className="text-purple-500" />,
      path: '/confession'
    },
    {
      id: 'campus',
      title: 'Campus Community',
      description: 'Discussions about campus life and events',
      icon: <School size={28} className="text-green-500" />,
      path: '/campus'
    },
    {
      id: 'forum',
      title: 'Forum',
      description: 'General discussions and topics',
      icon: <MessageSquareText size={28} className="text-cendy-blue" />,
      path: '/forum'
    },
    {
      id: 'nationwide',
      title: 'Nationwide Community',
      description: 'Connect with students across the country',
      icon: <Globe size={28} className="text-amber-500" />,
      path: '/nationwide'
    }
  ]);
  
  const handleChannelClick = (channelId: string, path: string) => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can post and interact with content.",
        variant: "default",
      });
    }
    
    // Navigate to the channel page
    navigate(path);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header title="Cendy" showProfile={false} />
      
      <main className="flex-1 p-4">
        <div className="mb-4 animate-fade-in">
          <h2 className="text-xl font-semibold text-cendy-text">Channels</h2>
        </div>
        
        <div className="space-y-3">
          {channels.map((channel, index) => (
            <ChannelCard
              key={channel.id}
              title={channel.title}
              description={channel.description}
              icon={channel.icon}
              onClick={() => handleChannelClick(channel.id, channel.path)}
              className={`animate-fade-in [animation-delay:${index * 100}ms]`}
            />
          ))}
        </div>
        
        {/* Verification status banner */}
        <div className={`mt-6 rounded-xl p-4 ${isVerified ? 'bg-green-50' : 'bg-amber-50'}`}>
          <p className={`text-sm ${isVerified ? 'text-green-700' : 'text-amber-700'}`}>
            {isVerified 
              ? '✓ You are a verified user with full access.' 
              : 'You are currently unverified. Sign in with your college email to get full access.'}
          </p>
          {isVerified && user?.university && (
            <p className="text-sm text-green-700 mt-1">
              School: {user.university}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
