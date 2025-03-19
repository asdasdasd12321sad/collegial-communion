
import React from 'react';
import Header from '@/components/layout/Header';
import { Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header title="Messages" />
      
      <main className="flex-1 p-4">
        {isVerified ? (
          <div className="animate-fade-in">
            <div className="mb-4 rounded-xl border border-cendy-gray-medium bg-white p-3">
              <div className="flex items-center gap-2 text-cendy-text-secondary">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search conversations"
                  className="flex-1 bg-transparent focus:outline-none"
                />
              </div>
            </div>
            
            <div className="rounded-xl bg-white shadow-sm">
              <div className="flex items-center border-b border-cendy-gray-medium p-4">
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
    </div>
  );
};

export default Messages;
