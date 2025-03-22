
import React from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isVerified = user?.verificationStatus === 'verified';
  
  const handleSearchClick = () => {
    // Navigate to message search page
    navigate('/messages/search');
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header 
        title="Messages" 
        centerTitle
        rightElement={
          <button onClick={handleSearchClick} className="text-cendy-text">
            <Search size={20} />
          </button>
        }
      />
      
      <main className="flex-1 p-4">
        {isVerified ? (
          <div className="animate-fade-in">
            <div className="rounded-xl bg-white shadow-sm">
              <div className="flex items-center p-4">
                <div className="flex-1 text-center text-sm text-cendy-text-secondary">
                  No conversations yet
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex animate-fade-in flex-col items-center justify-center rounded-xl border border-cendy-gray-medium bg-white p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cendy-gray">
              <Search size={24} className="text-cendy-text-secondary" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-cendy-text">Verification Required</h3>
            <p className="mb-4 text-sm text-cendy-text-secondary">
              Only verified users can send and receive messages. Sign in with your college email to access this feature.
            </p>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Messages;
