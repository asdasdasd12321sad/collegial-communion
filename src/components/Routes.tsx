
// src/components/Routes.tsx
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import Confession from '@/pages/Confession';
import ConfessionSearch from '@/pages/ConfessionSearch';
import Forum from '@/pages/Forum';
import ForumSearch from '@/pages/ForumSearch';
import Community from '@/pages/CommunityNationwide';
import CommunitySearch from '@/pages/CommunityNationwideSearch';
import CampusCommunity from '@/pages/CampusCommunity';
import CampusCommunitySearch from '@/pages/CampusCommunitySearch';
import Settings from '@/pages/Settings';
import UserProfile from '@/pages/UserProfile';
import DisplayNameForm from '@/components/auth/DisplayNameForm';
import EditProfile from '@/pages/EditProfile';
import Notifications from '@/pages/Notifications';
import Messages from '@/pages/Messages';
import MessagesHome from '@/pages/MessagesHome';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const Routes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cendy-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />

      {/* Display name form route */}
      <Route path="/set-display-name" element={<ProtectedRoute><DisplayNameForm /></ProtectedRoute>} />

      {/* Routes that require authentication */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/confession" element={<ProtectedRoute><Confession /></ProtectedRoute>} />
      <Route path="/confession/search" element={<ProtectedRoute><ConfessionSearch /></ProtectedRoute>} />
      <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
      <Route path="/forum/search" element={<ProtectedRoute><ForumSearch /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/community/search" element={<ProtectedRoute><CommunitySearch /></ProtectedRoute>} />
      <Route path="/campus-community" element={<ProtectedRoute><CampusCommunity /></ProtectedRoute>} />
      <Route path="/campus-community/search" element={<ProtectedRoute><CampusCommunitySearch /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/profile/:userId?" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/messages/home" element={<ProtectedRoute><MessagesHome /></ProtectedRoute>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
