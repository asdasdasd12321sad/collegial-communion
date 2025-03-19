
import React, { useState } from 'react';
import { Search, PlusCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ForumPost from '@/components/forum/ForumPost';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample forum posts data - in a real app, this would come from an API
const SAMPLE_FORUM_POSTS = [
  {
    id: '1',
    title: 'Best study spots on campus?',
    content: "I'm tired of the library. Where are your go-to places to study that aren't too crowded?",
    authorName: 'StudyBuddy',
    authorSchool: 'Harvard',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    reactions: { like: 15, heart: 7, laugh: 0, wow: 2, sad: 0, angry: 0 },
    commentCount: 12,
    tags: ['study', 'campus']
  },
  {
    id: '2',
    title: 'Anyone taking CS50 this semester?',
    content: "Looking for study partners for CS50. The problem sets are getting tough!",
    authorName: 'CodeWarrior',
    authorSchool: 'Stanford',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    reactions: { like: 8, heart: 3, laugh: 2, wow: 1, sad: 5, angry: 0 },
    commentCount: 7,
    tags: ['study', 'cs', 'classes']
  },
  {
    id: '3',
    title: 'Campus food recommendations?',
    content: "What's your favorite place to eat on or near campus? Trying to find some new spots!",
    authorName: 'FoodieStudent',
    authorSchool: 'Yale',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
    reactions: { like: 27, heart: 15, laugh: 0, wow: 8, sad: 0, angry: 0 },
    commentCount: 18,
    tags: ['food', 'fun']
  }
];

// Define filter categories
const FILTER_CATEGORIES = [
  { id: 'hot', label: 'Hot' },
  { id: 'new', label: 'New' },
  { id: 'study', label: 'Study' },
  { id: 'fun', label: 'Fun' },
  { id: 'drama', label: 'Drama' },
  { id: 'food', label: 'Food' },
  { id: 'career', label: 'Career' },
];

const Forum: React.FC = () => {
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [activeFilter, setActiveFilter] = useState('hot');
  const [posts, setPosts] = useState(SAMPLE_FORUM_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleCreatePost = () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can create forum posts.",
        variant: "default",
      });
      return;
    }
    
    // For this demo, we'll just show a toast notification
    toast({
      title: "Create Forum Post",
      description: "This feature is coming soon!",
    });
  };
  
  const handleReactionClick = (postId: string, reactionType: string) => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can react to posts.",
        variant: "default",
      });
      return;
    }
    
    // Update reactions (simulated)
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedReactions = { ...post.reactions };
          updatedReactions[reactionType as keyof typeof post.reactions] += 1;
          return { ...post, reactions: updatedReactions };
        }
        return post;
      })
    );
  };
  
  const handleOpenComments = (postId: string) => {
    // For this demo, we'll just show a toast notification
    toast({
      title: "Open Comments",
      description: `Opening comments for post ${postId}`,
    });
  };
  
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header title="Forum" />
      
      <main className="flex-1 p-4">
        {/* Search Bar */}
        <div className="mb-4 relative animate-fade-in">
          <input
            type="text"
            placeholder="Search forum posts..."
            className="w-full rounded-xl border border-cendy-gray-medium bg-white px-4 py-3 pl-10 focus:border-cendy-blue focus:outline-none focus:ring-1 focus:ring-cendy-blue"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-cendy-text-secondary" size={20} />
        </div>
        
        {/* Filter Categories */}
        <div className="mb-4 overflow-x-auto">
          <Tabs defaultValue="hot" className="w-full" value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="h-10 p-1 bg-transparent w-max space-x-1">
              {FILTER_CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-sm px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-cendy-blue"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Forum Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <ForumPost
              key={post.id}
              title={post.title}
              content={post.content}
              authorName={post.authorName}
              authorSchool={post.authorSchool}
              createdAt={post.createdAt}
              reactions={post.reactions}
              commentCount={post.commentCount}
              tags={post.tags}
              onReactionClick={(reactionType) => handleReactionClick(post.id, reactionType)}
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
            <p className="text-cendy-text-secondary">No forum posts found. Be the first to start a discussion!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Forum;
