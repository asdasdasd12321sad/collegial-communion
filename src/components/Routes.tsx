
import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Messages from '@/pages/Messages';
import Settings from '@/pages/Settings';
import Confession from '@/pages/Confession';
import Forum from '@/pages/Forum';
import CampusCommunity from '@/pages/CampusCommunity';
import CommunityNationwide from '@/pages/CommunityNationwide';
import ConfessionSearch from '@/pages/ConfessionSearch';
import ForumSearch from '@/pages/ForumSearch';
import CampusCommunitySearch from '@/pages/CampusCommunitySearch';
import CommunityNationwideSearch from '@/pages/CommunityNationwideSearch';
import DisplayNameForm from '@/components/auth/DisplayNameForm';
import BottomNavigation from '@/components/layout/BottomNavigation';
import LoadingScreen from '@/components/common/LoadingScreen';

const Routes: React.FC = () => {
  const { user, isLoading, needsDisplayName } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // If the user is signed in but needs a display name
  if (user && needsDisplayName) {
    return <DisplayNameForm />;
  }
  
  // If the user is not authenticated, show the Login page
  if (!user) {
    return (
      <RouterRoutes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </RouterRoutes>
    );
  }
  
  // The user is authenticated and has a display name
  return (
    <>
      <RouterRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/confession" element={<Confession />} />
        <Route path="/confession/search" element={<ConfessionSearch />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/search" element={<ForumSearch />} />
        <Route path="/campus" element={<CampusCommunity />} />
        <Route path="/campus/search" element={<CampusCommunitySearch />} />
        <Route path="/nationwide" element={<CommunityNationwide />} />
        <Route path="/nationwide/search" element={<CommunityNationwideSearch />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
      <BottomNavigation />
    </>
  );
};

export default Routes;
