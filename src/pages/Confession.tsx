
import React, { useState, useMemo } from 'react';
import { Search, PlusCircle, ArrowLeft, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ConfessionPost from '@/components/confession/ConfessionPost';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import NewPostModal from '@/components/post/NewPostModal';
import BottomNavigation from '@/components/layout/BottomNavigation';

// Sample confession posts data - in a real app, this would come from an API
const SAMPLE_CONFESSION_POSTS = [
  {
    id: '1',
    title: "Pretending to Understand Quantum Physics", // Added title
    content: "I've been pretending to understand quantum physics in my advanced physics class for the entire semester.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    reactions: { like: 25, heart: 12, laugh: 30, wow: 8, sad: 3, angry: 0 },
    commentCount: 15,
    topic: 'Classes'
  },
  {
    id: '2',
    title: "Called My Professor 'Mom'", // Added title
    content: "I accidentally called my professor 'mom' during a lecture and now I'm considering dropping the class.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(), // 15 hours ago
    reactions: { like: 87, heart: 20, laugh: 156, wow: 12, sad: 5, angry: 0 },
    commentCount: 42,
    topic: 'Embarrassing'
  },
  {
    id: '3',
    title: "Ramen for Three Weeks Straight", // Added title
    content: "I've been eating ramen for three weeks straight because I spent all my money on concert tickets.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    reactions: { like: 45, heart: 8, laugh: 15, wow: 3, sad: 28, angry: 0 },
    commentCount: 23,
    topic: 'Money'
  }
];

// Define sort options with icons
const SORT_OPTIONS = [
  { id: 'hot', label: 'Hot', icon: <TrendingUp size={16} /> },
  { id: 'new', label: 'New', icon: <Clock size={16} /> },
];

// Define topic filter options with icons
const TOPIC_FILTERS = [
  { id: 'all', label: 'All Categories' },
  { id: 'classes', label: 'Classes' },
  { id: 'embarrassing', label: 'Embarrassing' },
  { id: 'money', label: 'Money' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'campus', label: 'Campus' },
];

const Confession: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [sortOption, setSortOption] = useState('hot');
  const [topicFilter, setTopicFilter] = useState('all');
  const [posts, setPosts] = useState(SAMPLE_CONFESSION_POSTS);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  
  // Filter posts by topic
  const filteredPosts = useMemo(() => {
    if (topicFilter === 'all') return posts;
    
    return posts.filter(post => {
      // Case insensitive comparison
      return post.topic?.toLowerCase() === topicFilter.toLowerCase();
    });
  }, [posts, topicFilter]);
  
  const handleCreatePost = () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can create confession posts.",
        variant: "default",
      });
      return;
    }
    
    setIsNewPostModalOpen(true);
  };
  
  const handleReactionClick = (postId: string, reactionType: string) => {
    // Update reactions (simulated)
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedReactions = { ...post.reactions };
          
          if (reactionType === 'remove') {
            // Handle removing a reaction
            // In a real app, you would decrement the count
            return post;
          } else {
            updatedReactions[reactionType as keyof typeof post.reactions] += 1;
            return { ...post, reactions: updatedReactions };
          }
        }
        return post;
      })
    );
  };
  
  const handleOpenComments = (postId: string) => {
    // Navigate to chatroom for this post
    navigate(`/messages/${postId}`);
  };
  
  const handleSearchClick = () => {
    navigate('/confession/search');
  };
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleNewPost = (postData: any) => {
    // Add the new post to the list
    const newPost = {
      id: `post-${Date.now()}`,
      title: postData.title,
      content: postData.content,
      createdAt: postData.createdAt,
      reactions: { like: 0, heart: 0, laugh: 0, wow: 0, sad: 0, angry: 0 },
      commentCount: 0,
      topic: postData.topic
    };
    
    // Add to start of posts array
    setPosts([newPost, ...posts]);
    
    // In a real app, this would also create a chatroom
    console.log("Creating chatroom with data:", postData);
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
      <Header 
        title="Confession" 
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
      
      {/* Filter Options */}
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
        {/* Confession Posts */}
        <div className="space-y-0">
          {filteredPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <ConfessionPost
                title={post.title}
                content={post.content}
                createdAt={formatTimestamp(post.createdAt)}
                reactions={post.reactions}
                commentCount={post.commentCount}
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
        
        {/* Floating Add Button */}
        <button
          onClick={handleCreatePost}
          className="floating-add-button"
        >
          <PlusCircle size={20} className="text-white" />
        </button>
        
        {/* Empty state if no posts match the filter */}
        {filteredPosts.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-cendy-text-secondary">No confessions found that match the selected topic.</p>
          </div>
        )}
        
        {/* New Post Modal */}
        <NewPostModal 
          isOpen={isNewPostModalOpen}
          onClose={() => setIsNewPostModalOpen(false)}
          onPost={handleNewPost}
        />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Confession;
