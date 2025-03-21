
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
  className?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  centerTitle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showProfile = false, 
  className,
  rightElement,
  leftElement,
  centerTitle = false
}) => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlHeader = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 40) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);
      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
  }, [lastScrollY]);
  
  return (
    <header className={cn(
      "sticky top-0 z-10 bg-white/80 backdrop-blur-md transition-transform duration-300",
      !visible && "-translate-y-full",
      className
    )}>
      <div className="flex h-16 items-center justify-between px-4">
        {leftElement ? (
          leftElement
        ) : (
          <div className="w-8"></div> // Empty spacer when no left element
        )}
        
        <h1 className={cn(
          "text-xl font-bold text-cendy-text",
          centerTitle && "absolute left-1/2 transform -translate-x-1/2"
        )}>
          {title}
        </h1>
        
        {rightElement ? (
          rightElement
        ) : (
          showProfile && user && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cendy-blue text-sm font-medium text-white">
                {user.displayName?.[0] || '?'}
              </div>
            </div>
          )
        )}
      </div>
    </header>
  );
};

export default Header;
