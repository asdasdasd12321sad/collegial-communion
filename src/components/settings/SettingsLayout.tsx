
import React, { useState } from 'react';
import { ChevronRight, User, Bell, ChevronLeft } from 'lucide-react';
import EditProfileForm from './EditProfileForm';
import NotificationSettings from './NotificationSettings';

type SettingsSection = 'main' | 'profile' | 'notifications';

const SettingsLayout = () => {
  const [currentSection, setCurrentSection] = useState<SettingsSection>('main');
  const [title, setTitle] = useState('Settings');

  const navigateTo = (section: SettingsSection, sectionTitle: string) => {
    setCurrentSection(section);
    setTitle(sectionTitle);
  };

  const handleBack = () => {
    setCurrentSection('main');
    setTitle('Settings');
  };

  return (
    <div className="w-full">
      {/* Header for subsections */}
      {currentSection !== 'main' && (
        <div className="flex items-center mb-4">
          <button onClick={handleBack} className="mr-2">
            <ChevronLeft size={20} className="text-cendy-text" />
          </button>
          <h2 className="text-lg font-semibold text-cendy-text">{title}</h2>
        </div>
      )}

      {/* Main settings menu */}
      {currentSection === 'main' && (
        <div className="space-y-2">
          <button
            onClick={() => navigateTo('profile', 'Edit Profile')}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center">
              <User size={18} className="text-cendy-text-secondary mr-3" />
              <span className="text-cendy-text font-medium">Edit Profile</span>
            </div>
            <ChevronRight size={18} className="text-cendy-text-secondary" />
          </button>

          <button
            onClick={() => navigateTo('notifications', 'Notifications')}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center">
              <Bell size={18} className="text-cendy-text-secondary mr-3" />
              <span className="text-cendy-text font-medium">Notifications</span>
            </div>
            <ChevronRight size={18} className="text-cendy-text-secondary" />
          </button>
        </div>
      )}

      {/* Profile edit section */}
      {currentSection === 'profile' && <EditProfileForm />}

      {/* Notifications section */}
      {currentSection === 'notifications' && <NotificationSettings />}
    </div>
  );
};

export default SettingsLayout;
