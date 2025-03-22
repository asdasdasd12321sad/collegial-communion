import React, { useState } from 'react';
import { Search, PlusCircle, ArrowLeft, MessageCircle, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ForumPost from '@/components/forum/ForumPost';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';

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
    topic: 'Campus'
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
    topic: 'Classes'
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
    topic: 'Food'
  }
];

// Define sort options with icons - fixed duplicate icons issue
const SORT_OPTIONS = [
  { id: 'hot', label: 'Hot', icon: <TrendingUp size={16} /> },
  { id: 'new', label: 'New', icon: <Clock size={16} /> },
];

// Define topic filter options with icons
const TOPIC_FILTERS = [
  { id: 'all', label: 'All Categories' },
  { id: 'fun', label: 'Fun' },
  { id: 'drama', label: 'Drama' },
  { id: 'food', label: 'Food' },
  { id: 'career', label: 'Career' },
  { id: 'classes', label: 'Classes' },
  { id: 'campus', label: 'Campus' },
];

const Forum: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [sortOption, setSortOption] = useState('hot');
  const [topicFilter, setTopicFilter] = useState('all');
  const [posts, setPosts] = useState(SAMPLE_FORUM_POSTS);
  
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
  
  const handleSearchClick = () => {
    navigate('/forum/search');
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
  
  // Add a filter function to filter posts by topic
  const filteredPosts = React.useMemo(() => {
    if (topicFilter === 'all') return posts;
    
    return posts.filter(post => {
      // Case insensitive comparison
      return post.topic?.toLowerCase() === topicFilter.toLowerCase();
    });
  }, [posts, topicFilter]);
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header 
        title="Forum" 
        centerTitle
        leftElement={
          <button onClick={handleBackClick} className="flex items-center text-cendy-text">
            <ArrowLeft size={20} />
          </button>
        }
        rightElement={
          <button onClick={handleSearchClick} className="text-cendy-text">
            <Search size={20} />
          </button>
        }
      />
      
      {/* Filter Options - improved appearance and moved closer to header */}
      <div className="flex px-4 py-2 gap-2 bg-white shadow-sm">
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="bg-white rounded-xl border border-cendy-gray-medium h-9 px-3 py-1 text-sm">
            <div className="flex items-center gap-2">
              {SORT_OPTIONS.find(opt => opt.id === sortOption)?.icon}
              <SelectValue placeholder="Sort By" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={topicFilter} onValueChange={setTopicFilter}>
          <SelectTrigger className="bg-white rounded-xl border border-cendy-gray-medium h-9 px-3 py-1 text-sm">
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
      
      <main className="flex-1 p-0">
        {/* Forum Posts - Using filtered posts instead of posts */}
        <div className="space-y-0">
          {filteredPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <ForumPost
                title={post.title}
                content={post.content}
                authorName={post.authorName}
                authorSchool={post.authorSchool}
                createdAt={formatTimestamp(post.createdAt)}
                reactions={post.reactions}
                commentCount={post.commentCount}
                tags={[]}
                onReactionClick={(reactionType) => handleReactionClick(post.id, reactionType)}
                onCommentClick={() => handleOpenComments(post.id)}
                className="px-4 py-3"
                topic={post.topic}
                fullWidth={true}
                authorId={post.id} // Using post.id as author ID for demo
              />
              {index < filteredPosts.length - 1 && (
                <div className="post-separator mx-auto"></div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Floating Add Button - simplified design */}
        <button
          onClick={handleCreatePost}
          className="floating-add-button"
        >
          <PlusCircle size={20} className="text-white" />
        </button>
        
        {/* Empty state if no posts match the filter */}
        {filteredPosts.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-cendy-text-secondary">No forum posts found that match the selected topic.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Forum;
