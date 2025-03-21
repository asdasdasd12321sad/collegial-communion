
import React from 'react';
import { LogOut, ChevronRight, User, Bell, Shield, HelpCircle, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const SettingItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  showArrow?: boolean;
}> = ({ icon, label, onClick, showArrow = true }) => (
  <div
    onClick={onClick}
    className="flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors hover:bg-cendy-gray"
  >
    <div className="flex items-center gap-3">
      <div className="text-cendy-text-secondary">{icon}</div>
      <span>{label}</span>
    </div>
    {showArrow && <ChevronRight size={20} className="text-cendy-text-secondary" />}
  </div>
);

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <div className="sticky top-0 z-10 border-b border-cendy-gray-medium bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-bold text-cendy-text">Settings</h1>
        </div>
      </div>
      
      <main className="flex-1 p-4">
        <div className="animate-fade-in rounded-xl bg-white shadow-sm">
          {/* User Profile Section */}
          <div className="border-b border-cendy-gray-medium p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cendy-blue text-xl font-medium text-white">
                {user?.displayName?.[0] || '?'}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-cendy-text">{user?.displayName}</h3>
                <p className="text-sm text-cendy-text-secondary">{user?.email}</p>
                <div className={`mt-1 flex ${isVerified ? 'text-green-500' : 'text-amber-500'}`}>
                  <span className="text-xs font-medium">
                    {isVerified ? 'Verified User' : 'Unverified User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Settings List */}
          <div className="divide-y divide-cendy-gray-medium">
            <SettingItem
              icon={<User size={20} />}
              label="Account"
              onClick={() => toast({ title: "Account Settings", description: "Coming soon" })}
            />
            
            <SettingItem
              icon={<Bell size={20} />}
              label="Notifications"
              onClick={() => toast({ title: "Notification Settings", description: "Coming soon" })}
            />
            
            <SettingItem
              icon={<Shield size={20} />}
              label="Privacy & Security"
              onClick={() => toast({ title: "Privacy Settings", description: "Coming soon" })}
            />
            
            <SettingItem
              icon={<HelpCircle size={20} />}
              label="Help Center"
              onClick={() => toast({ title: "Help Center", description: "Coming soon" })}
            />
            
            <SettingItem
              icon={<Info size={20} />}
              label="About Cendy"
              onClick={() => toast({ title: "About", description: "Cendy v1.0.0" })}
            />
            
            <SettingItem
              icon={<LogOut size={20} className="text-red-500" />}
              label="Logout"
              showArrow={false}
              onClick={handleLogout}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
