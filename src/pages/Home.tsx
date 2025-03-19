
import React, { useState } from 'react';
import { Hash, Globe, LayoutList, Building, ArrowRight } from 'lucide-react';
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
      icon: <Hash size={24} />,
      count: 12,
      path: '/confession'
    },
    {
      id: 'campus',
      title: 'Community - Campus',
      description: 'Discussions about campus life and events',
      icon: <Building size={24} />,
      count: 8,
      path: '/campus'
    },
    {
      id: 'forum',
      title: 'Forum',
      description: 'General discussions and topics',
      icon: <LayoutList size={24} />,
      count: 5,
      path: '/forum'
    },
    {
      id: 'nationwide',
      title: 'Community - Nationwide',
      description: 'Connect with students across the country',
      icon: <Globe size={24} />,
      count: 3,
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
      <Header title="Cendy" />
      
      <main className="flex-1 p-4">
        <div className="mb-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-cendy-text">Channels</h2>
            
            <button className="flex items-center gap-1 text-sm text-cendy-blue">
              See all
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {channels.map((channel, index) => (
            <ChannelCard
              key={channel.id}
              title={channel.title}
              description={channel.description}
              icon={channel.icon}
              count={channel.count}
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
        </div>
      </main>
    </div>
  );
};

export default Home;
