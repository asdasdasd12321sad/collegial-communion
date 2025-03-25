
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

type NotificationSetting = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

const NotificationsSettings = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'newMessage',
      label: 'New Messages',
      description: 'Get notified when you receive new messages',
      enabled: true,
    },
    {
      id: 'postReactions',
      label: 'Post Reactions',
      description: 'Get notified when someone reacts to your posts',
      enabled: true,
    },
    {
      id: 'mentions',
      label: 'Mentions',
      description: 'Get notified when someone mentions you',
      enabled: true,
    },
    {
      id: 'newPosts',
      label: 'New Posts',
      description: 'Get notified about new posts in your communities',
      enabled: false,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting => {
        if (setting.id === id) {
          // Show toast message
          toast({
            title: setting.enabled ? 'Notification disabled' : 'Notification enabled',
            description: `${setting.label} notifications ${setting.enabled ? 'turned off' : 'turned on'}`,
          });
          
          return { ...setting, enabled: !setting.enabled };
        }
        return setting;
      })
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-cendy-text-secondary">
        Configure which notifications you want to receive
      </p>
      
      {settings.map((setting) => (
        <div key={setting.id} className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-cendy-text">{setting.label}</h4>
            <p className="text-xs text-cendy-text-secondary">{setting.description}</p>
          </div>
          <Switch
            checked={setting.enabled}
            onCheckedChange={() => toggleSetting(setting.id)}
            aria-label={`Toggle ${setting.label}`}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationsSettings;
