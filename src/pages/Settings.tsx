
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Bell, 
  Lock, 
  LogOut, 
  HelpCircle, 
  Flag, 
  FileText, 
  Shield,
  Mail,
  School,
  Calendar
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import SettingsLayout from '@/components/settings/SettingsLayout';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      // Redirect to login page after logout
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
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
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray">
      <Header title="Settings" centerTitle />
      
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-cendy-text mb-4">Account</h2>
            
            <div className="flex items-center mb-4">
              <Avatar className="h-14 w-14 bg-cendy-blue text-white">
                {user?.profilePictureUrl ? (
                  <AvatarImage src={user.profilePictureUrl} alt={user?.displayName || 'Profile'} />
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
                  Joined {formatJoinDate(user?.createdAt)}
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
        </div>
        
        {/* Settings Layout Component */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="p-4">
            <SettingsLayout />
          </div>
        </div>
        
        {/* Support Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-cendy-text mb-2">Support</h2>
          </div>
          
          <div>
            <button
              onClick={() => {
                toast({
                  title: "Help Center",
                  description: "Redirecting to help resources...",
                });
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <HelpCircle size={18} className="text-cendy-text-secondary" />
                <span className="ml-3 font-medium">Help Center</span>
              </div>
            </button>
            
            <button
              onClick={() => {
                toast({
                  title: "Report Problem",
                  description: "This feature will be available soon.",
                });
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Flag size={18} className="text-cendy-text-secondary" />
                <span className="ml-3 font-medium">Report a Problem</span>
              </div>
            </button>
            
            <button
              onClick={() => {
                toast({
                  title: "Terms of Service",
                  description: "Redirecting to Terms of Service...",
                });
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <FileText size={18} className="text-cendy-text-secondary" />
                <span className="ml-3 font-medium">Terms of Service</span>
              </div>
            </button>
            
            <button
              onClick={() => {
                toast({
                  title: "Privacy Policy",
                  description: "Redirecting to Privacy Policy...",
                });
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Shield size={18} className="text-cendy-text-secondary" />
                <span className="ml-3 font-medium">Privacy Policy</span>
              </div>
            </button>
          </div>
        </div>
        
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
