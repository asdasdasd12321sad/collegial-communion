
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Bell, 
  Lock, 
  LogOut, 
  HelpCircle, 
  Flag, 
  FileText, 
  Shield, 
  ChevronRight,
  Mail,
  School,
  Calendar,
  Image
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  // Get auth provider display name
  const getAuthProviderName = (provider?: string) => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'microsoft':
        return 'Microsoft';
      case 'apple':
        return 'Apple';
      case 'email':
      default:
        return 'Email';
    }
  };
  
  // Section components for better organization
  const SettingItem = ({ 
    icon: Icon, 
    label, 
    onClick, 
    danger = false 
  }: { 
    icon: React.ElementType; 
    label: string; 
    onClick: () => void; 
    danger?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors ${
        danger ? 'text-red-500' : 'text-cendy-text'
      }`}
    >
      <div className="flex items-center">
        <Icon size={18} className={danger ? 'text-red-500' : 'text-cendy-text-secondary'} />
        <span className="ml-3 font-medium">{label}</span>
      </div>
      <ChevronRight size={16} className="text-cendy-text-secondary" />
    </button>
  );
  
  const AccountSection = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-cendy-text mb-4">Account</h2>
        
        <div className="flex items-center mb-4">
          <Avatar className="h-14 w-14 bg-cendy-blue text-white">
            {user?.profilePicture ? (
              <AvatarImage src={user.profilePicture} alt={user?.displayName || 'Profile'} />
            ) : (
              <AvatarFallback>
                {user?.displayName?.[0] || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="ml-3">
            <div className="font-semibold text-base">{user?.displayName || 'User'}</div>
            <div className="text-sm text-cendy-text-secondary flex items-center">
              <Mail size={14} className="mr-1" />
              {user?.email}
            </div>
            {user?.university && (
              <div className="text-sm text-cendy-text-secondary flex items-center mt-0.5">
                <School size={14} className="mr-1" />
                {user.university}
              </div>
            )}
            <div className="text-sm text-cendy-text-secondary flex items-center mt-0.5">
              <Calendar size={14} className="mr-1" />
              Joined {formatJoinDate(user?.joinedAt)}
            </div>
          </div>
        </div>
        
        {user?.authProvider && (
          <div className="text-xs bg-cendy-gray-medium/20 rounded-full px-3 py-1 inline-block text-cendy-text-secondary mb-2">
            Sign in with {getAuthProviderName(user.authProvider)}
          </div>
        )}
        
        <div className="text-xs bg-cendy-gray-medium/20 rounded-full px-3 py-1 inline-block text-cendy-text-secondary ml-2 mb-2">
          {user?.verificationStatus === 'verified' ? '✓ Verified' : '⚠ Unverified'}
        </div>
      </div>
      
      <div>
        <SettingItem 
          icon={User} 
          label="Edit Profile" 
          onClick={() => navigate('/profile')} 
        />
        
        <SettingItem 
          icon={Image} 
          label="Manage Photos" 
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "Photo management will be available soon.",
            });
          }} 
        />
        
        <SettingItem 
          icon={Bell} 
          label="Notifications" 
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "Notification settings will be available soon.",
            });
          }} 
        />
        
        <SettingItem 
          icon={Lock} 
          label="Privacy" 
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "Privacy settings will be available soon.",
            });
          }} 
        />
      </div>
    </div>
  );
  
  const SupportSection = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-cendy-text mb-2">Support</h2>
      </div>
      
      <div>
        <SettingItem 
          icon={HelpCircle} 
          label="Help Center" 
          onClick={() => {
            toast({
              title: "Help Center",
              description: "Redirecting to help resources...",
            });
          }} 
        />
        
        <SettingItem 
          icon={Flag} 
          label="Report a Problem" 
          onClick={() => {
            toast({
              title: "Report Problem",
              description: "This feature will be available soon.",
            });
          }} 
        />
        
        <SettingItem 
          icon={FileText} 
          label="Terms of Service" 
          onClick={() => {
            toast({
              title: "Terms of Service",
              description: "Redirecting to Terms of Service...",
            });
          }} 
        />
        
        <SettingItem 
          icon={Shield} 
          label="Privacy Policy" 
          onClick={() => {
            toast({
              title: "Privacy Policy",
              description: "Redirecting to Privacy Policy...",
            });
          }} 
        />
      </div>
    </div>
  );
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray">
      <Header title="Settings" centerTitle />
      
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        <AccountSection />
        <SupportSection />
        
        <div className="mt-6 mb-24">
          <button
            className="w-full rounded-lg border border-red-200 bg-white py-3 text-center text-red-500 font-medium shadow-sm"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Settings;
