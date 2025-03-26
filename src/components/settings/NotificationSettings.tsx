
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const NotificationSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    newMessages: true,
    mentions: true,
    newPosts: false,
    appUpdates: true,
    emailNotifications: true,
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-cendy-text">New Messages</h3>
          <p className="text-xs text-cendy-text-secondary">Get notified when you receive new messages</p>
        </div>
        <Switch 
          checked={settings.newMessages} 
          onCheckedChange={() => handleToggle('newMessages')} 
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-cendy-text">Mentions</h3>
          <p className="text-xs text-cendy-text-secondary">Get notified when you are mentioned in posts or comments</p>
        </div>
        <Switch 
          checked={settings.mentions} 
          onCheckedChange={() => handleToggle('mentions')} 
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-cendy-text">New Posts</h3>
          <p className="text-xs text-cendy-text-secondary">Get notified about new posts from your university</p>
        </div>
        <Switch 
          checked={settings.newPosts} 
          onCheckedChange={() => handleToggle('newPosts')} 
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-cendy-text">App Updates</h3>
          <p className="text-xs text-cendy-text-secondary">Get notified about app updates and new features</p>
        </div>
        <Switch 
          checked={settings.appUpdates} 
          onCheckedChange={() => handleToggle('appUpdates')} 
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-cendy-text">Email Notifications</h3>
          <p className="text-xs text-cendy-text-secondary">Receive notifications via email</p>
        </div>
        <Switch 
          checked={settings.emailNotifications} 
          onCheckedChange={() => handleToggle('emailNotifications')} 
        />
      </div>
      
      <Button 
        onClick={handleSave} 
        className="w-full bg-cendy-blue hover:bg-cendy-blue-dark"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Saving...
          </>
        ) : (
          'Save Preferences'
        )}
      </Button>
    </div>
  );
};

export default NotificationSettings;
