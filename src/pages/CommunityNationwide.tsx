
import React, { useState, useMemo } from 'react';
import { Search, PlusCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import NationwideCommunityPost from '@/components/Nationwide_community/Nationwide_community_post';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import NewPostModal from '@/components/post/NewPostModal';
import BottomNavigation from '@/components/layout/BottomNavigation';

const SAMPLE_NATIONWIDE_POSTS = [
  {
    id: '1',
    title: 'MBA Scholarships for International Students',
    content: "Anyone know about good MBA programs that offer scholarships for international students?",
    authorName: 'GlobalStudent',
    authorUniversity: 'Stanford',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    commentCount: 7,
    hasImage: false,
    topic: 'Education'
  },
  {
    id: '2',
    title: 'Nationwide Hackathon',
    content: "Trying to organize a nationwide hackathon. Looking for campus representatives from different universities. DM if interested!",
    authorName: 'TechOrganizer',
    authorUniversity: 'MIT',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    commentCount: 12,
    hasImage: false,
    topic: 'Events'
  },
  {
    id: '3',
    title: 'National Leadership Conference',
    content: "Just got back from the National Student Leadership Conference in DC. Amazing experience! Here are some photos from the event.",
    authorName: 'LeadershipEnthusiast',
    authorUniversity: 'Georgetown',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    commentCount: 23,
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    topic: 'Student Life'
  }
];

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
  const [topicFilter, setTopicFilter] = useState('all');
  const [posts, setPosts] = useState(SAMPLE_NATIONWIDE_POSTS);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  
  const filteredPosts = useMemo(() => {
    if (topicFilter === 'all') return posts;
    
    return posts.filter(post => {
      return post.topic?.toLowerCase() === topicFilter.toLowerCase();
    });
  }, [posts, topicFilter]);
  
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
    
    // Navigate to direct chat with the post author
    navigate(`/messages/direct/${postId}`);
  };
  
  const handleSearchClick = () => {
    navigate('/nationwide/search');
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
      authorName: user?.displayName || 'User',
      authorUniversity: user?.university || 'University',
      createdAt: postData.createdAt,
      commentCount: 0,
      hasImage: false,
      topic: postData.topic
    };
    
    // Add to start of posts array
    setPosts([newPost, ...posts]);
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
        title="Community" 
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
        <div className="space-y-0">
          {filteredPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <NationwideCommunityPost
                key={post.id}
                title={post.title}
                content={post.content}
                authorName={post.authorName}
                authorUniversity={post.authorUniversity}
                createdAt={formatTimestamp(post.createdAt)}
                commentCount={0}
                imageUrl={post.hasImage ? post.imageUrl : undefined}
                onPostClick={() => handleOpenPost(post.authorName, post.id)}
                className="px-4 py-3"
                topic={post.topic}
                fullWidth={true}
                authorId={post.id}
              />
              {index < filteredPosts.length - 1 && (
                <div className="post-separator mx-auto"></div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <button
          onClick={handleCreatePost}
          className="floating-add-button"
        >
          <PlusCircle size={20} className="text-white" />
        </button>
        
        {filteredPosts.length === 0 && (
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

export default CommunityNationwide;
