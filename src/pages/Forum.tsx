
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ForumPost from '@/components/forum/ForumPost';
import { PlusCircle, Search } from 'lucide-react';
import NewPostModal from '@/components/post/NewPostModal';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNavigation from '@/components/layout/BottomNavigation';
import CustomPagination from '@/components/ui/custom-pagination';
import { supabase } from '@/integrations/supabase/client';

const TOPIC_FILTERS = [
  { id: 'all', label: 'All Categories' },
  { id: 'classes', label: 'Classes' },
  { id: 'embarrassing', label: 'Embarrassing' },
  { id: 'money', label: 'Money' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'campus', label: 'Campus' },
];

const POSTS_PER_PAGE = 5;

const Forum: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topicFilter, setTopicFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      
      try {
        // Calculate pagination range
        const from = (currentPage - 1) * POSTS_PER_PAGE;
        const to = from + POSTS_PER_PAGE - 1;
        
        // Start with base query
        let query = supabase
          .from('posts')
          .select(`
            id,
            title,
            content,
            author_id,
            profiles(display_name, university),
            created_at,
            topic,
            chatroom_id
          `)
          .eq('post_type', 'forum');
        
        // Apply topic filter if not 'all'
        if (topicFilter !== 'all') {
          query = query.ilike('topic', topicFilter);
        }
        
        // Apply sorting and pagination
        query = query.order('created_at', { ascending: false })
          .range(from, to);
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching forum posts:', error);
          return;
        }
        
        // Get total count for pagination
        const { count, error: countError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('post_type', 'forum')
          .ilike('topic', topicFilter !== 'all' ? topicFilter : '%');
        
        if (countError) {
          console.error('Error fetching count:', countError);
          return;
        }
        
        // Calculate total pages
        setTotalPages(Math.max(1, Math.ceil((count || 0) / POSTS_PER_PAGE)));
        
        // Format posts
        const formattedPosts = data.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.author_id,
          authorName: post.profiles?.display_name || 'Anonymous',
          authorUniversity: post.profiles?.university || 'Unknown University',
          createdAt: post.created_at,
          topic: post.topic,
          commentCount: 0, // This would be fetched from a separate table if needed
          chatroomId: post.chatroom_id
        }));
        
        setForumPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching forum posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage, topicFilter]);
  
  const handleOpenPost = (chatroomId: string) => {
    if (chatroomId) {
      navigate(`/messages/chatroom/${chatroomId}`);
    }
  };
  
  const handleNewPost = (postData: any) => {
    // Refresh posts after creating a new one
    if (currentPage === 1) {
      // If on first page, just refresh the current page
      const fetchPosts = async () => {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select(`
              id,
              title,
              content,
              author_id,
              profiles(display_name, university),
              created_at,
              topic,
              chatroom_id
            `)
            .eq('post_type', 'forum')
            .order('created_at', { ascending: false })
            .range(0, POSTS_PER_PAGE - 1);
          
          if (error) {
            console.error('Error fetching updated forum posts:', error);
            return;
          }
          
          const formattedPosts = data.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            authorId: post.author_id,
            authorName: post.profiles?.display_name || 'Anonymous',
            authorUniversity: post.profiles?.university || 'Unknown University',
            createdAt: post.created_at,
            topic: post.topic,
            commentCount: 0,
            chatroomId: post.chatroom_id
          }));
          
          setForumPosts(formattedPosts);
        } catch (error) {
          console.error('Error refreshing posts:', error);
        }
      };
      
      fetchPosts();
    } else {
      // If not on first page, navigate to first page to see the new post
      setCurrentPage(1);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-16">
      <Header 
        title="Forum" 
        centerTitle 
        rightElement={
          <button onClick={() => navigate('/forum/search')} className="text-cendy-text">
            <Search size={20} />
          </button>
        }
      />
      
      {/* Topic Filter */}
      <div className="px-4 py-2 bg-white">
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
      
      <main className="flex-1 p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cendy-blue"></div>
          </div>
        ) : forumPosts.length > 0 ? (
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <ForumPost
                key={post.id}
                title={post.title}
                content={post.content}
                authorName={post.authorName}
                createdAt={post.createdAt}
                commentCount={post.commentCount}
                onPostClick={() => handleOpenPost(post.chatroomId)}
                university={post.authorUniversity}
                topic={post.topic}
              />
            ))}
            
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-cendy-text-secondary">No forum posts found. Be the first to create one!</p>
          </div>
        )}
        
        {/* Add Post Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed right-6 bottom-20 bg-cendy-blue text-white rounded-full p-3 shadow-lg z-10 hover:bg-cendy-blue-dark transition-colors"
        >
          <PlusCircle size={24} />
        </button>
        
        {/* New Post Modal */}
        <NewPostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPost={handleNewPost}
        />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Forum;
