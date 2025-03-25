
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, ArrowLeft, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ForumPost from '@/components/forum/ForumPost';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { supabase } from '@/integrations/supabase/client';
import NewPostModal from '@/components/post/NewPostModal';

const SORT_OPTIONS = [
  { id: 'hot', label: 'Hot', icon: <TrendingUp size={16} /> },
  { id: 'new', label: 'New', icon: <Clock size={16} /> },
];

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
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      
      try {
        let query = supabase
          .from('posts')
          .select(`
            id,
            title,
            content,
            author_id,
            topic,
            created_at,
            profiles(display_name, university)
          `)
          .eq('post_type', 'forum')
          .order(sortOption === 'new' ? 'created_at' : 'updated_at', { ascending: false });
        
        if (topicFilter !== 'all') {
          query = query.eq('topic', topicFilter);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedPosts = data.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            authorId: post.author_id,
            authorName: post.profiles?.[0]?.display_name || 'Anonymous',
            authorSchool: post.profiles?.[0]?.university || 'Unknown University',
            createdAt: post.created_at,
            commentCount: 0,
            topic: post.topic,
            reactions: { 
              like: 0, 
              heart: 0, 
              laugh: 0, 
              wow: 0, 
              sad: 0, 
              angry: 0 
            }
          }));
          
          setPosts(formattedPosts);
        }
      } catch (error) {
        console.error('Error fetching forum posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load forum posts. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
    
    const channel = supabase
      .channel('forum-posts-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
        filter: `post_type=eq.forum`
      }, (payload) => {
        const fetchAuthorAndUpdatePosts = async () => {
          const post = payload.new as any;
          
          const { data: authorData } = await supabase
            .from('profiles')
            .select('display_name, university')
            .eq('id', post.author_id)
            .single();
          
          const newPost = {
            id: post.id,
            title: post.title,
            content: post.content,
            authorId: post.author_id,
            authorName: authorData?.display_name || 'Anonymous',
            authorSchool: authorData?.university || 'Unknown University',
            createdAt: post.created_at,
            commentCount: 0,
            topic: post.topic,
            reactions: { 
              like: 0, 
              heart: 0, 
              laugh: 0, 
              wow: 0, 
              sad: 0, 
              angry: 0 
            }
          };
          
          setPosts(prevPosts => [newPost, ...prevPosts]);
        };
        
        fetchAuthorAndUpdatePosts();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sortOption, topicFilter]);
  
  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to create a post.",
        variant: "default",
      });
      return;
    }
    
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can create forum posts.",
        variant: "default",
      });
      return;
    }
    
    setIsPostModalOpen(true);
  };
  
  const handleReactionClick = async (postId: string, reactionType: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to react to posts.",
        variant: "default",
      });
      return;
    }
    
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can react to posts.",
        variant: "default",
      });
      return;
    }
    
    try {
      const { data: existingReactions } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id);
      
      if (existingReactions && existingReactions.length > 0) {
        await supabase
          .from('post_reactions')
          .update({ reaction_type: reactionType })
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          });
      }
      
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
      console.error('Error updating reaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to update reaction. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleOpenComments = (postId: string) => {
    toast({
      title: "Opening Comments",
      description: "Redirecting to comment section...",
    });
    // You can add navigation to a detailed comment page here
  };
  
  const handleSearchClick = () => {
    navigate('/forum/search');
  };
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handlePostCreated = (newPost: any) => {
    console.log("New post created:", newPost);
    
    setTimeout(() => {
      setPosts(prevPosts => {
        const exists = prevPosts.some(post => post.id === newPost.id);
        if (exists) return prevPosts;
        
        return [
          {
            ...newPost,
            authorName: user?.displayName || 'Anonymous',
            authorSchool: user?.university || 'Unknown University',
            createdAt: new Date().toISOString(),
            commentCount: 0,
            reactions: { 
              like: 0, 
              heart: 0, 
              laugh: 0, 
              wow: 0, 
              sad: 0, 
              angry: 0 
            }
          },
          ...prevPosts
        ];
      });
    }, 500);
  };
  
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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-cendy-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {posts.map((post, index) => (
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
                    authorId={post.authorId}
                    currentUserId={user?.id}
                  />
                  {index < posts.length - 1 && (
                    <div className="post-separator mx-auto"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {posts.length === 0 && (
              <div className="mt-8 text-center">
                <p className="text-cendy-text-secondary">No forum posts found that match the selected topic.</p>
                {isVerified && (
                  <button
                    onClick={handleCreatePost}
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-cendy-blue px-4 py-2 text-sm font-medium text-white hover:bg-cendy-blue/90"
                  >
                    Create a post
                  </button>
                )}
              </div>
            )}
          </>
        )}
        
        <button
          onClick={handleCreatePost}
          className="floating-add-button"
        >
          <PlusCircle size={20} className="text-white" />
        </button>
      </main>
      
      <NewPostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onPost={handlePostCreated}
      />
    </div>
  );
};

export default Forum;
