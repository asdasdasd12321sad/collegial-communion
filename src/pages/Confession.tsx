
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, ArrowLeft, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ConfessionPost from '@/components/confession/ConfessionPost';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import NewPostModal from '@/components/post/NewPostModal';
import BottomNavigation from '@/components/layout/BottomNavigation';
import CustomPagination from '@/components/ui/custom-pagination';
import { supabase } from '@/integrations/supabase/client';

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

// Number of posts per page
const POSTS_PER_PAGE = 5;

const Confession: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [sortOption, setSortOption] = useState('hot');
  const [topicFilter, setTopicFilter] = useState('all');
  const [posts, setPosts] = useState<any[]>([]);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  
  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      
      try {
        // Calculate offset for pagination
        const offset = (currentPage - 1) * POSTS_PER_PAGE;
        
        // Query for total count (for pagination)
        let countQuery = supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .eq('post_type', 'confession');
        
        // Apply topic filter if not 'all'
        if (topicFilter !== 'all') {
          countQuery = countQuery.ilike('topic', topicFilter);
        }
        
        const { count, error: countError } = await countQuery;
        
        if (countError) {
          console.error('Error fetching count:', countError);
          return;
        }
        
        // Set total posts count and calculate total pages
        const totalCount = count || 0;
        setTotalPosts(totalCount);
        setTotalPages(Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE)));
        
        // Main query for posts with pagination
        let query = supabase
          .from('posts')
          .select(`
            id,
            title,
            content,
            created_at,
            topic,
            author_id,
            chatroom_id
          `)
          .eq('post_type', 'confession');
        
        // Apply sort option
        if (sortOption === 'hot') {
          // Sort by popularity (you might need a separate reactions count query for this)
          query = query.order('created_at', { ascending: false });
        } else if (sortOption === 'new') {
          query = query.order('created_at', { ascending: false });
        }
        
        // Apply topic filter if not 'all'
        if (topicFilter !== 'all') {
          query = query.ilike('topic', topicFilter);
        }
        
        // Apply pagination
        query = query.range(offset, offset + POSTS_PER_PAGE - 1);
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching posts:', error);
          return;
        }
        
        // Get reaction counts for each post
        const postIds = data.map(post => post.id);
        let reactionCountsData: Record<string, any> = {};
        
        if (postIds.length > 0) {
          const { data: reactionsData, error: reactionsError } = await supabase
            .from('post_reactions')
            .select('post_id, reaction_type')
            .in('post_id', postIds);
          
          if (reactionsError) {
            console.error('Error fetching reactions:', reactionsError);
          } else if (reactionsData) {
            // Count reactions by type for each post
            reactionCountsData = reactionsData.reduce((acc: Record<string, any>, reaction) => {
              const postId = reaction.post_id;
              const reactionType = reaction.reaction_type;
              
              if (!acc[postId]) {
                acc[postId] = { like: 0, heart: 0, laugh: 0, wow: 0, sad: 0, angry: 0 };
              }
              
              if (acc[postId][reactionType] !== undefined) {
                acc[postId][reactionType] += 1;
              }
              
              return acc;
            }, {});
          }
        }
        
        // Format posts for display
        const formattedPosts = data.map(post => {
          // Get reaction counts for this post, or use default values if none exist
          const reactions = reactionCountsData[post.id] || { like: 0, heart: 0, laugh: 0, wow: 0, sad: 0, angry: 0 };
          
          return {
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.created_at,
            reactions: reactions,
            commentCount: 0, // You might fetch this from a separate query if needed
            topic: post.topic,
            authorId: post.author_id,
            chatroomId: post.chatroom_id
          };
        });
        
        setPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage, topicFilter, sortOption]);
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when changing page
    window.scrollTo(0, 0);
  };
  
  // Filter posts by topic - now handled directly in the database query
  const filteredPosts = posts;
  
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
  
  const handleReactionClick = async (postId: string, reactionType: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to react to posts.",
        variant: "default",
      });
      return;
    }
    
    try {
      // Add the reaction to the database
      const { error } = await supabase
        .from('post_reactions')
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      // Update the UI optimistically
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
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction. Please try again.",
        variant: "destructive",
      });
    }
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
  
  const handleNewPost = async (postData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a post.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: postData.title,
            content: postData.content,
            topic: postData.topic,
            author_id: user.id,
            post_type: 'confession',
            anonymous: true, // Set confession posts as anonymous
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Add the new post to the list if we're on the first page
      if (currentPage === 1 && sortOption === 'new') {
        // Create formatted post
        const newPost = {
          id: data[0].id,
          title: postData.title,
          content: postData.content,
          createdAt: new Date().toISOString(),
          reactions: { like: 0, heart: 0, laugh: 0, wow: 0, sad: 0, angry: 0 },
          commentCount: 0,
          topic: postData.topic,
          authorId: user.id,
          chatroomId: data[0].chatroom_id
        };
        
        // Add to start of posts array
        setPosts([newPost, ...posts.slice(0, POSTS_PER_PAGE - 1)]);
        
        // Update total posts count and pages
        setTotalPosts(prev => prev + 1);
        setTotalPages(Math.max(1, Math.ceil((totalPosts + 1) / POSTS_PER_PAGE)));
      } else {
        // If not on first page or not sorting by new, reset to first page to see new posts
        setCurrentPage(1);
        setSortOption('new');
      }
      
      toast({
        title: "Confession Posted",
        description: "Your confession has been published successfully.",
      });
    } catch (error) {
      console.error('Error creating confession:', error);
      toast({
        title: "Error",
        description: "Failed to post confession. Please try again.",
        variant: "destructive",
      });
    }
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
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cendy-blue"></div>
          </div>
        )}
        
        {/* Confession Posts */}
        {!isLoading && (
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
                  onCommentClick={() => handleOpenComments(post.chatroomId || post.id)}
                  className="px-4 py-3"
                  topic={post.topic}
                  fullWidth={true}
                  authorId={post.authorId}
                />
                {index < filteredPosts.length - 1 && (
                  <div className="post-separator mx-auto"></div>
                )}
              </React.Fragment>
            ))}
            
            {/* Pagination component */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Floating Add Button */}
        <button
          onClick={handleCreatePost}
          className="floating-add-button"
        >
          <PlusCircle size={20} className="text-white" />
        </button>
        
        {/* Empty state if no posts match the filter */}
        {!isLoading && filteredPosts.length === 0 && (
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
