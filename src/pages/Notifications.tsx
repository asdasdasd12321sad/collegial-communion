
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { ChevronLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  
  // State for notification preferences
  const [preferences, setPreferences] = useState({
    messages: true,
    confessions: true,
    comments: true,
    mentions: true,
    reactions: true,
    communityPosts: true,
    newFollowers: true,
    appUpdates: false,
    emails: false,
  });

  const handleToggle = (setting: keyof typeof preferences) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, [setting]: !prev[setting] };
      
      // In a real app, we would save this to the database
      // For now, we'll just show a toast
      toast({
        title: "Notification Setting Updated",
        description: `${setting} notifications ${newPreferences[setting] ? 'enabled' : 'disabled'}.`,
      });
      
      return newPreferences;
    });
  };

  // Component for a notification setting
  const NotificationSetting = ({ 
    id, 
    label, 
    description,
    value,
    onChange 
  }: { 
    id: keyof typeof preferences; 
    label: string; 
    description?: string;
    value: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-cendy-text">
          {label}
        </label>
        {description && (
          <p className="text-xs text-cendy-text-secondary">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={value}
        onCheckedChange={onChange}
      />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray">
      <Header 
        title="Notifications" 
        centerTitle={true} 
        leftIcon={<ChevronLeft size={24} onClick={() => navigate('/settings')} />}
      />
      
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-cendy-text">Push Notifications</h2>
          
          <div className="space-y-1 divide-y divide-gray-100">
            <NotificationSetting
              id="messages"
              label="Messages"
              description="Get notified about new messages"
              value={preferences.messages}
              onChange={() => handleToggle('messages')}
            />
            
            <NotificationSetting
              id="confessions"
              label="Confessions"
              description="Updates on confessions you've interacted with"
              value={preferences.confessions}
              onChange={() => handleToggle('confessions')}
            />
            
            <NotificationSetting
              id="comments"
              label="Comments"
              description="When someone comments on your posts"
              value={preferences.comments}
              onChange={() => handleToggle('comments')}
            />
            
            <NotificationSetting
              id="mentions"
              label="Mentions"
              description="When someone mentions you"
              value={preferences.mentions}
              onChange={() => handleToggle('mentions')}
            />
            
            <NotificationSetting
              id="reactions"
              label="Reactions"
              description="When someone reacts to your posts"
              value={preferences.reactions}
              onChange={() => handleToggle('reactions')}
            />
            
            <NotificationSetting
              id="communityPosts"
              label="Community Posts"
              description="Updates from your university community"
              value={preferences.communityPosts}
              onChange={() => handleToggle('communityPosts')}
            />
            
            <NotificationSetting
              id="newFollowers"
              label="New Followers"
              description="When someone follows you"
              value={preferences.newFollowers}
              onChange={() => handleToggle('newFollowers')}
            />
            
            <NotificationSetting
              id="appUpdates"
              label="App Updates"
              description="New features and improvements"
              value={preferences.appUpdates}
              onChange={() => handleToggle('appUpdates')}
            />
          </div>
        </div>
        
        <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-cendy-text">Email Notifications</h2>
          
          <div className="space-y-1">
            <NotificationSetting
              id="emails"
              label="Email Notifications"
              description="Receive updates via email (weekly digest)"
              value={preferences.emails}
              onChange={() => handleToggle('emails')}
            />
          </div>
        </div>
        
        <p className="mt-4 text-xs text-cendy-text-secondary text-center">
          You can change your notification preferences at any time.
        </p>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Notifications;
