
import React, { useState } from 'react';
import { Search, ArrowLeft, PlusCircle, MessageCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import CommunityPost from '@/components/community/CommunityPost';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';

// Sample community posts for nationwide - in a real app, this would come from an API
const SAMPLE_NATIONWIDE_POSTS = [
  {
    id: '1',
    content: "Anyone know about good MBA programs that offer scholarships for international students?",
    authorName: 'GlobalStudent',
    authorGender: 'Male',
    authorUniversity: 'Stanford',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    commentCount: 7,
    hasImage: false,
    topic: 'Education'
  },
  {
    id: '2',
    content: "Trying to organize a nationwide hackathon. Looking for campus representatives from different universities. DM if interested!",
    authorName: 'TechOrganizer',
    authorGender: 'Female',
    authorUniversity: 'MIT',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    commentCount: 12,
    hasImage: false,
    topic: 'Events'
  },
  {
    id: '3',
    content: "Just got back from the National Student Leadership Conference in DC. Amazing experience! Here are some photos from the event.",
    authorName: 'LeadershipEnthusiast',
    authorGender: 'Non-binary',
    authorUniversity: 'Georgetown',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    commentCount: 23,
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    topic: 'Student Life'
  }
];

// Define sort options
const SORT_OPTIONS = [
  { id: 'hot', label: 'Hot' },
  { id: 'new', label: 'New' },
];

// Define topic filter options
const TOPIC_FILTERS = [
  { id: 'all', label: 'All Categories' },
  { id: 'education', label: 'Education' },
  { id: 'events', label: 'Events' },
  { id: 'sports', label: 'Sports' },
  { id: 'studentLife', label: 'Student Life' },
  { id: 'career', label: 'Career' },
  { id: 'housing', label: 'Housing' },
  { id: 'travel', label: 'Travel' },
];

const CommunityNationwide: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [sortOption, setSortOption] = useState('hot');
  const [topicFilter, setTopicFilter] = useState('all');
  const [posts, setPosts] = useState(SAMPLE_NATIONWIDE_POSTS);
  
  const handleCreatePost = () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can create community posts.",
        variant: "default",
      });
      return;
    }
    
    // For this demo, we'll just show a toast notification
    toast({
      title: "Create Community Post",
      description: "This feature is coming soon!",
    });
  };
  
  const handleOpenChat = (authorName: string) => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can chat with other users.",
        variant: "default",
      });
      return;
    }
    
    toast({
      title: "Open Chat",
      description: `Starting chat with ${authorName}`,
    });
  };
  
  const handleOpenComments = (postId: string) => {
    toast({
      title: "Open Comments",
      description: `Opening comments for post ${postId}`,
    });
  };
  
  const handleSearchClick = () => {
    navigate('/nationwide/search');
  };
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  // Format timestamp
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
      return date.toLocaleDateString();
    } else if (diffDays >= 1) {
      return `${diffDays}d`;
    } else {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours >= 1) {
        return `${diffHours}h`;
      } else {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        if (diffMinutes >= 1) {
          return `${diffMinutes}m`;
        } else {
          const diffSeconds = Math.floor(diffTime / 1000);
          return `${diffSeconds}s`;
        }
      }
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <div className="sticky top-0 z-10 border-b border-cendy-gray-medium bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4">
          <button onClick={handleBackClick} className="flex items-center text-cendy-text">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-cendy-text text-center flex-1">Community</h1>
          <button onClick={handleSearchClick} className="text-cendy-text">
            <Search size={20} />
          </button>
        </div>
        
        {/* Filter Options */}
        <div className="flex p-2 gap-2">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="bg-white rounded-xl border border-cendy-gray-medium h-10 px-4 py-2">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="bg-white rounded-xl border border-cendy-gray-medium h-10 px-4 py-2">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {TOPIC_FILTERS.map((filter) => (
                <SelectItem key={filter.id} value={filter.id}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <main className="flex-1 p-0">
        {/* Community Posts */}
        <div className="space-y-2">
          {posts.map((post, index) => (
            <CommunityPost
              key={post.id}
              content={post.content}
              authorName={post.authorName}
              authorGender={post.authorGender}
              authorUniversity={post.authorUniversity}
              createdAt={formatTimestamp(post.createdAt)}
              commentCount={post.commentCount}
              imageUrl={post.hasImage ? post.imageUrl : undefined}
              onChatClick={() => handleOpenChat(post.authorName)}
              onCommentClick={() => handleOpenComments(post.id)}
              className="border-b border-cendy-gray-medium rounded-none px-4 py-3"
              topic={post.topic}
              fullWidth={true}
            />
          ))}
        </div>
        
        {/* Floating Add Button */}
        <button
          onClick={handleCreatePost}
          className="fixed bottom-24 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-cendy-blue text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <PlusCircle size={24} />
        </button>
        
        {/* Empty state if no posts match the filter */}
        {posts.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-cendy-text-secondary">No community posts found. Be the first to share!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CommunityNationwide;
