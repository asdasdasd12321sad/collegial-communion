
import React, { useState } from 'react';
import { Search, PlusCircle, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ConfessionPost from '@/components/confession/ConfessionPost';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample confession data - in a real app, this would come from an API
const SAMPLE_CONFESSIONS = [
  {
    id: '1',
    content: "I've been pretending to understand calculus all semester. Finals are next week. Help!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    reactions: { like: 24, laugh: 13, sad: 5, angry: 0 },
    commentCount: 8,
    anonymous: true
  },
  {
    id: '2',
    content: "I accidentally called my professor 'mom' during office hours today.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    reactions: { like: 56, laugh: 42, sad: 2, angry: 0 },
    commentCount: 15,
    anonymous: true
  },
  {
    id: '3',
    content: "I've been eating ramen for 14 days straight because I spent my meal plan money on concert tickets. Worth it though!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    reactions: { like: 34, laugh: 12, sad: 20, angry: 0 },
    commentCount: 5,
    anonymous: true
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
  { id: 'dorm', label: 'Dorm Life' },
];

const Confession: React.FC = () => {
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [activeFilter, setActiveFilter] = useState('hot');
  const [confessions, setConfessions] = useState(SAMPLE_CONFESSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleCreatePost = () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can create confession posts.",
        variant: "default",
      });
      return;
    }
    
    // For this demo, we'll just show a toast notification
    toast({
      title: "Create Confession",
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
    setConfessions(prevConfessions => 
      prevConfessions.map(confession => {
        if (confession.id === postId) {
          const updatedReactions = { ...confession.reactions };
          updatedReactions[reactionType as keyof typeof confession.reactions] += 1;
          return { ...confession, reactions: updatedReactions };
        }
        return confession;
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
  
  const filteredConfessions = confessions.filter(confession => 
    confession.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header title="Confession" />
      
      <main className="flex-1 p-4">
        {/* Search Bar */}
        <div className="mb-4 relative animate-fade-in">
          <input
            type="text"
            placeholder="Search confessions..."
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
        
        {/* Confession Posts */}
        <div className="space-y-4">
          {filteredConfessions.map((confession, index) => (
            <ConfessionPost
              key={confession.id}
              content={confession.content}
              createdAt={confession.createdAt}
              reactions={confession.reactions}
              commentCount={confession.commentCount}
              anonymous={confession.anonymous}
              onReactionClick={(reactionType) => handleReactionClick(confession.id, reactionType)}
              onCommentClick={() => handleOpenComments(confession.id)}
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
        
        {/* Empty state if no confessions match the filter */}
        {filteredConfessions.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-cendy-text-secondary">No confessions found. Be the first to share!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Confession;
