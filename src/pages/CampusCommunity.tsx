
import React, { useState } from 'react';
import { Search, PlusCircle, MessageCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import CommunityPost from '@/components/community/CommunityPost';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample community posts - in a real app, this would come from an API
const SAMPLE_CAMPUS_POSTS = [
  {
    id: '1',
    content: "Looking for a roommate next semester! I'm a junior studying Computer Science. DM if interested!",
    authorName: 'Alex Thompson',
    authorGender: 'Male',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    commentCount: 3,
    hasImage: false
  },
  {
    id: '2',
    content: "Anyone want to form a study group for Biology 101? Finals are coming up!",
    authorName: 'Jamie Wilson',
    authorGender: 'Female',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
    commentCount: 7,
    hasImage: false
  },
  {
    id: '3',
    content: "Check out the sunset from my dorm window! Campus looks amazing today.",
    authorName: 'Riley Evans',
    authorGender: 'Non-binary',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    commentCount: 15,
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1472213984618-c79aaec300c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
];

// Define gender filter options
const GENDER_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'l', label: 'L' },
  { id: 'g', label: 'G' },
  { id: 'b', label: 'B' },
  { id: 't', label: 'T' },
];

const CampusCommunity: React.FC = () => {
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [activeFilter, setActiveFilter] = useState('all');
  const [posts, setPosts] = useState(SAMPLE_CAMPUS_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  
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
    
    // For this demo, we'll just show a toast notification
    toast({
      title: "Open Chat",
      description: `Starting chat with ${authorName}`,
    });
  };
  
  const handleOpenComments = (postId: string) => {
    // For this demo, we'll just show a toast notification
    toast({
      title: "Open Comments",
      description: `Opening comments for post ${postId}`,
    });
  };
  
  // Filter posts based on gender and search query
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = activeFilter === 'all' || 
                          post.authorGender.toLowerCase() === activeFilter.toLowerCase();
    
    return matchesSearch && matchesGender;
  });
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header title="Campus Community" />
      
      <main className="flex-1 p-4">
        {/* Search Bar */}
        <div className="mb-4 relative animate-fade-in">
          <input
            type="text"
            placeholder="Search community posts..."
            className="w-full rounded-xl border border-cendy-gray-medium bg-white px-4 py-3 pl-10 focus:border-cendy-blue focus:outline-none focus:ring-1 focus:ring-cendy-blue"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-cendy-text-secondary" size={20} />
        </div>
        
        {/* Gender Filters */}
        <div className="mb-4 overflow-x-auto">
          <Tabs defaultValue="all" className="w-full" value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="h-10 p-1 bg-transparent w-max space-x-1">
              {GENDER_FILTERS.map((filter) => (
                <TabsTrigger
                  key={filter.id}
                  value={filter.id}
                  className="text-sm px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-cendy-blue"
                >
                  {filter.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Community Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <CommunityPost
              key={post.id}
              content={post.content}
              authorName={post.authorName}
              authorGender={post.authorGender}
              createdAt={post.createdAt}
              commentCount={post.commentCount}
              imageUrl={post.hasImage ? post.imageUrl : undefined}
              onChatClick={() => handleOpenChat(post.authorName)}
              onCommentClick={() => handleOpenComments(post.id)}
              className={`animate-fade-in [animation-delay:${index * 100}ms]`}
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
        {filteredPosts.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-cendy-text-secondary">No community posts found. Be the first to share!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CampusCommunity;
