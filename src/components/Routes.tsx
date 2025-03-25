
import React from 'react';
import { Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Messages from '@/pages/Messages';
import MessagesHome from '@/pages/MessagesHome';
import MessagesChatroom from '@/pages/MessagesChatroom';
import MessagesPrivate from '@/pages/MessagesPrivate';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Forum from '@/pages/Forum';
import ForumSearch from '@/pages/ForumSearch';
import Confession from '@/pages/Confession';
import ConfessionSearch from '@/pages/ConfessionSearch';
import CampusCommunity from '@/pages/CampusCommunity';
import CampusCommunitySearch from '@/pages/CampusCommunitySearch';
import CommunityNationwide from '@/pages/CommunityNationwide';
import CommunityNationwideSearch from '@/pages/CommunityNationwideSearch';
import UserProfile from '@/pages/UserProfile';

import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/common/LoadingScreen';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
      
      {/* Messages routes */}
      <Route path="/messages" element={user ? <MessagesHome /> : <Navigate to="/login" />} />
      <Route path="/messages/search" element={user ? <MessagesHome /> : <Navigate to="/login" />} />
      <Route path="/messages/chatroom/:chatroomId" element={user ? <MessagesChatroom /> : <Navigate to="/login" />} />
      <Route path="/messages/direct/:userId" element={user ? <MessagesPrivate /> : <Navigate to="/login" />} />
      
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
      
      {/* Forum routes */}
      <Route path="/forum" element={user ? <Forum /> : <Navigate to="/login" />} />
      <Route path="/forum/search" element={user ? <ForumSearch /> : <Navigate to="/login" />} />
      
      {/* Confession routes */}
      <Route path="/confession" element={user ? <Confession /> : <Navigate to="/login" />} />
      <Route path="/confession/search" element={user ? <ConfessionSearch /> : <Navigate to="/login" />} />
      
      {/* Campus Community routes */}
      <Route path="/campus" element={user ? <CampusCommunity /> : <Navigate to="/login" />} />
      <Route path="/campus/search" element={user ? <CampusCommunitySearch /> : <Navigate to="/login" />} />
      
      {/* Nationwide Community routes */}
      <Route path="/nationwide" element={user ? <CommunityNationwide /> : <Navigate to="/login" />} />
      <Route path="/nationwide/search" element={user ? <CommunityNationwideSearch /> : <Navigate to="/login" />} />
      
      {/* User Profile route */}
      <Route path="/profile/:userId" element={user ? <UserProfile /> : <Navigate to="/login" />} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
