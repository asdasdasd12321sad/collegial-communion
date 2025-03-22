
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray">
      <Header title="Settings" centerTitle />
      
      <main className="flex-1 p-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Account</h2>
          
          <div className="mb-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-cendy-blue text-white flex items-center justify-center font-medium text-lg">
              {user?.displayName?.[0] || 'U'}
            </div>
            <div className="ml-3">
              <div className="font-medium">{user?.displayName || 'User'}</div>
              <div className="text-sm text-cendy-text-secondary">{user?.email}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              className="w-full rounded-lg border border-cendy-gray-medium py-2 text-center text-cendy-text"
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </button>
            
            <button
              className="w-full rounded-lg border border-cendy-gray-medium py-2 text-center text-cendy-text"
              onClick={() => {}}
            >
              Notifications
            </button>
            
            <button
              className="w-full rounded-lg border border-cendy-gray-medium py-2 text-center text-cendy-text"
              onClick={() => {}}
            >
              Privacy
            </button>
            
            <button
              className="w-full rounded-lg border border-red-200 py-2 text-center text-red-500"
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        </div>
        
        <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Support</h2>
          
          <div className="space-y-3">
            <button
              className="w-full rounded-lg border border-cendy-gray-medium py-2 text-center text-cendy-text"
              onClick={() => {}}
            >
              Help Center
            </button>
            
            <button
              className="w-full rounded-lg border border-cendy-gray-medium py-2 text-center text-cendy-text"
              onClick={() => {}}
            >
              Report a Problem
            </button>
            
            <button
              className="w-full rounded-lg border border-cendy-gray-medium py-2 text-center text-cendy-text"
              onClick={() => {}}
            >
              Terms of Service
            </button>
            
            <button
              className="w-full rounded-lg border border-cendy-gray-medium py-2 text-center text-cendy-text"
              onClick={() => {}}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Settings;
