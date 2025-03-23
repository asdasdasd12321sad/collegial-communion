
import React, { useState, useMemo, useEffect } from 'react';
import { Search, PlusCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import CampusCommunityPost from '@/components/Campus_community/Campus_community_post';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import NewPostModal from '@/components/post/NewPostModal';
import BottomNavigation from '@/components/layout/BottomNavigation';
import CustomPagination from '@/components/ui/custom-pagination';
import { supabase } from '@/integrations/supabase/client';

// Define topic filter options
const TOPIC_FILTERS = [
  { id: 'all', label: 'All Categories' },
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'l', label: 'L' },
  { id: 'g', label: 'G' },
  { id: 'b', label: 'B' },
  { id: 't', label: 'T' },
  { id: 'housing', label: 'Housing' },
  { id: 'study', label: 'Study' },
  { id: 'campus', label: 'Campus' },
];

// Number of posts per page
const POSTS_PER_PAGE = 5;

const CampusCommunity: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
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
          .from('community_posts')
          .select('id', { count: 'exact', head: true })
          .eq('community_type', 'campus');
        
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
          .from('community_posts')
          .select(`
            id,
            title,
            content,
            created_at,
            topic,
            author_id,
            profiles(display_name, university)
          `)
          .eq('community_type', 'campus')
          .order('created_at', { ascending: false })
          .range(offset, offset + POSTS_PER_PAGE - 1);
        
        // Apply topic filter if not 'all'
        if (topicFilter !== 'all') {
          query = query.ilike('topic', topicFilter);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching posts:', error);
          return;
        }
        
        // Format posts for display
        const formattedPosts = data.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          authorName: post.profiles?.display_name || 'Anonymous',
          createdAt: post.created_at,
          commentCount: 0, // You may fetch this from a separate query if needed
          hasImage: false, // To be implemented with storage
          topic: post.topic,
          authorId: post.author_id
        }));
        
        setPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage, topicFilter]);
  
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
        description: "Only verified users can create community posts.",
        variant: "default",
      });
      return;
    }
    
    setIsNewPostModalOpen(true);
  };
  
  const handleOpenPost = (authorName: string, postId: string) => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can chat with other users.",
        variant: "default",
      });
      return;
    }
    
    // Navigate to direct chat with post author
    navigate(`/messages/direct/${postId}`);
  };
  
  const handleSearchClick = () => {
    navigate('/campus/search');
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
        .from('community_posts')
        .insert([
          {
            title: postData.title,
            content: postData.content,
            topic: postData.topic,
            author_id: user.id,
            community_type: 'campus',
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Add the new post to the list if we're on the first page
      if (currentPage === 1) {
        // Create formatted post
        const newPost = {
          id: data[0].id,
          title: postData.title,
          content: postData.content,
          authorName: user.displayName || 'User',
          createdAt: new Date().toISOString(),
          commentCount: 0,
          hasImage: false,
          topic: postData.topic,
          authorId: user.id
        };
        
        // Add to start of posts array
        setPosts([newPost, ...posts.slice(0, POSTS_PER_PAGE - 1)]);
        
        // Update total posts count and pages
        setTotalPosts(prev => prev + 1);
        setTotalPages(Math.max(1, Math.ceil((totalPosts + 1) / POSTS_PER_PAGE)));
      } else {
        // If not on first page, navigate to first page to see the new post
        setCurrentPage(1);
      }
      
      toast({
        title: "Post Created",
        description: "Your post has been published successfully.",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
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
        title="Campus Community" 
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
      <div className="flex px-4 py-2 bg-white shadow-sm">
        <Select value={topicFilter} onValueChange={setTopicFilter}>
          <SelectTrigger className="bg-white rounded-xl border border-cendy-gray-medium h-9 px-3 py-1 text-sm w-full">
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
        
        {/* Community Posts */}
        {!isLoading && (
          <div className="space-y-0">
            {filteredPosts.map((post, index) => (
              <React.Fragment key={post.id}>
                <CampusCommunityPost
                  title={post.title}
                  content={post.content}
                  authorName={post.authorName}
                  createdAt={formatTimestamp(post.createdAt)}
                  commentCount={0}
                  imageUrl={post.hasImage ? post.imageUrl : undefined}
                  onPostClick={() => handleOpenPost(post.authorName, post.id)}
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
            <p className="text-cendy-text-secondary">No community posts found that match the selected topic.</p>
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

export default CampusCommunity;
