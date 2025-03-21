
import React, { useState } from 'react';
import { Search, PlusCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import CommunityPost from '@/components/community/CommunityPost';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';

// Sample community posts - in a real app, this would come from an API
const SAMPLE_CAMPUS_POSTS = [
  {
    id: '1',
    title: 'Looking for a Roommate',
    content: "Looking for a roommate next semester! I'm a junior studying Computer Science. DM if interested!",
    authorName: 'Alex Thompson',
    authorGender: 'Male',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    commentCount: 3,
    hasImage: false,
    topic: 'Housing'
  },
  {
    id: '2',
    title: 'Biology 101 Study Group',
    content: "Anyone want to form a study group for Biology 101? Finals are coming up!",
    authorName: 'Jamie Wilson',
    authorGender: 'Female',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
    commentCount: 7,
    hasImage: false,
    topic: 'Study'
  },
  {
    id: '3',
    title: 'Beautiful Campus Sunset',
    content: "Check out the sunset from my dorm window! Campus looks amazing today.",
    authorName: 'Riley Evans',
    authorGender: 'Non-binary',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    commentCount: 15,
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1472213984618-c79aaec300c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    topic: 'Campus'
  }
];

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

const CampusCommunity: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [topicFilter, setTopicFilter] = useState('all');
  const [posts, setPosts] = useState(SAMPLE_CAMPUS_POSTS);
  
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
  
  const handleOpenPost = (authorName: string, postId: string) => {
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
  
  const handleSearchClick = () => {
    navigate('/campus/search');
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
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <div className="sticky top-0 z-10 border-b border-cendy-gray-medium bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4">
          <button onClick={handleBackClick} className="flex items-center text-cendy-text">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-cendy-text text-center flex-1">Campus Community</h1>
          <button onClick={handleSearchClick} className="text-cendy-text">
            <Search size={20} />
          </button>
        </div>
        
        {/* Filter Options - moved up closer to headline */}
        <div className="flex pt-0 pb-2 px-4">
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
      </div>
      
      <main className="flex-1 p-0">
        {/* Community Posts */}
        <div className="space-y-0">
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <CommunityPost
                title={post.title}
                content={post.content}
                authorName={post.authorName}
                authorGender={post.authorGender}
                createdAt={formatTimestamp(post.createdAt)}
                commentCount={0}
                imageUrl={post.hasImage ? post.imageUrl : undefined}
                onPostClick={() => handleOpenPost(post.authorName, post.id)}
                className="border-b border-cendy-gray-medium rounded-none px-4 py-3"
                topic={post.topic}
                fullWidth={true}
              />
              {index < posts.length - 1 && (
                <div className="mx-auto w-full border-b-2 border-cendy-gray-medium"></div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Floating Add Button - updated design */}
        <button
          onClick={handleCreatePost}
          className="fixed bottom-24 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-cendy-blue text-white shadow-lg"
        >
          <PlusCircle size={24} className="text-white" />
        </button>
        
        {/* Empty state if no posts match the filter */}
        {posts.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-cendy-text-secondary">No community posts found. Be the first to share!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CampusCommunity;
