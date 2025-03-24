
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, ChevronLeft, User } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { toast } from '@/hooks/use-toast';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [communityNotifications, setCommunityNotifications] = useState(true);
  const [confessionNotifications, setConfessionNotifications] = useState(true);
  
  const toggleNotification = (
    setting: boolean, 
    setSetting: React.Dispatch<React.SetStateAction<boolean>>,
    type: string
  ) => {
    setSetting(!setting);
    toast({
      title: `${type} notifications ${!setting ? 'enabled' : 'disabled'}`,
      description: `You will ${!setting ? 'now' : 'no longer'} receive ${type.toLowerCase()} notifications.`
    });
  };

  const handleGoBack = () => {
    navigate('/settings');
  };

  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-16">
      <div className="sticky top-0 z-10 flex h-16 items-center bg-white px-4 shadow-sm">
        <button onClick={handleGoBack} className="mr-4">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Notifications</h1>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-cendy-blue bg-opacity-10 p-2">
                    <Bell size={20} className="text-cendy-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-cendy-text-secondary">
                      Receive notifications on your device
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={() => toggleNotification(pushNotifications, setPushNotifications, 'Push')} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-cendy-blue bg-opacity-10 p-2">
                    <User size={20} className="text-cendy-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-cendy-text-secondary">
                      Receive important updates via email
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={() => toggleNotification(emailNotifications, setEmailNotifications, 'Email')} 
                />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Content Notifications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Message Notifications</p>
                  <p className="text-sm text-cendy-text-secondary">
                    When someone sends you a message
                  </p>
                </div>
                <Switch 
                  checked={messageNotifications} 
                  onCheckedChange={() => toggleNotification(messageNotifications, setMessageNotifications, 'Message')} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Community Posts</p>
                  <p className="text-sm text-cendy-text-secondary">
                    Updates from community activities
                  </p>
                </div>
                <Switch 
                  checked={communityNotifications} 
                  onCheckedChange={() => toggleNotification(communityNotifications, setCommunityNotifications, 'Community')} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Confession Updates</p>
                  <p className="text-sm text-cendy-text-secondary">
                    When someone interacts with your confession
                  </p>
                </div>
                <Switch 
                  checked={confessionNotifications} 
                  onCheckedChange={() => toggleNotification(confessionNotifications, setConfessionNotifications, 'Confession')} 
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              setEmailNotifications(false);
              setPushNotifications(false);
              setMessageNotifications(false);
              setCommunityNotifications(false);
              setConfessionNotifications(false);
              
              toast({
                title: "All notifications disabled",
                description: "You will no longer receive any notifications.",
              });
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-red-600"
          >
            <BellOff size={16} />
            <span>Disable All Notifications</span>
          </button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Notifications;
