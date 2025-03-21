
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const isVerified = user?.verificationStatus === 'verified';
  
  const navigationItems = [
    { path: '/', label: 'Home', icon: <Home className="nav-icon" /> },
    { 
      path: '/messages', 
      label: 'Messages', 
      icon: <MessageCircle className="nav-icon" />,
      requiresVerification: true
    },
    { path: '/settings', label: 'Settings', icon: <Settings className="nav-icon" /> },
  ];
  
  const handleNavigation = (path: string, requiresVerification: boolean) => {
    if (requiresVerification && !isVerified) {
      toast({
        title: "Access Restricted",
        description: "Only verified users can send messages.",
        variant: "destructive",
      });
      return;
    }
    
    navigate(path);
  };

  const controlNavbar = () => {
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
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);
  
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 animate-fade-in bg-white transition-transform duration-300",
      !visible && "translate-y-full"
    )}>
      <div className="flex h-16 items-center justify-around">
        {navigationItems.map((item) => (
          <div 
            key={item.path}
            onClick={() => handleNavigation(item.path, !!item.requiresVerification)}
            className={`nav-item button-transition ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span className="nav-text">{item.label}</span>
          </div>
        ))}
      </div>
      
      {/* Add safe area padding for iOS devices */}
      <div className="h-safe-area-bottom w-full bg-white" />
    </div>
  );
};

export default BottomNavigation;
