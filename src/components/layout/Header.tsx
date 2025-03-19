
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, showProfile = true, className }) => {
  const { user } = useAuth();
  
  return (
    <header className={cn(
      "sticky top-0 z-10 border-b border-cendy-gray-medium bg-white/80 backdrop-blur-md",
      className
    )}>
      <div className="flex h-16 items-center justify-between px-4">
        <h1 className="text-xl font-bold text-cendy-text">{title}</h1>
        
        {showProfile && user && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cendy-blue text-sm font-medium text-white">
              {user.displayName?.[0] || '?'}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
