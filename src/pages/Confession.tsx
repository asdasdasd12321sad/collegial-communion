
import React, { useState } from 'react';
import { Search, PlusCircle, ArrowLeft, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ConfessionPost from '@/components/confession/ConfessionPost';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';

// Sample confession data - in a real app, this would come from an API
const SAMPLE_CONFESSIONS = [
  {
    id: '1',
    title: 'Failing Calculus',
    content: "I've been pretending to understand calculus all semester. Finals are next week. Help!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    reactions: { like: 24, heart: 8, laugh: 13, wow: 5, sad: 5, angry: 0 },
    commentCount: 8,
    anonymous: false,
    topic: 'Study'
  },
  {
    id: '2',
    title: 'Classroom Embarrassment',
    content: "I accidentally called my professor 'mom' during office hours today.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    reactions: { like: 56, heart: 32, laugh: 42, wow: 12, sad: 2, angry: 0 },
    commentCount: 15,
    anonymous: false,
    topic: 'Awkward'
  },
  {
    id: '3',
    title: 'Ramen Life',
    content: "I've been eating ramen for 14 days straight because I spent my meal plan money on concert tickets. Worth it though!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    reactions: { like: 34, heart: 18, laugh: 12, wow: 3, sad: 20, angry: 0 },
    commentCount: 5,
    anonymous: false,
    topic: 'Food'
  }
];

// Define sort options with icons
const SORT_OPTIONS = [
  { id: 'hot', label: 'Hot', icon: <TrendingUp size={16} className="mr-2" /> },
  { id: 'new', label: 'New', icon: <Clock size={16} className="mr-2" /> },
];

// Define topic filter options
const TOPIC_FILTERS = [
  { id: 'all', label: 'All Categories' },
  { id: 'study', label: 'Study' },
  { id: 'fun', label: 'Fun' },
  { id: 'drama', label: 'Drama' },
  { id: 'food', label: 'Food' },
  { id: 'dorm', label: 'Dorm Life' },
  { id: 'awkward', label: 'Awkward' },
  { id: 'love', label: 'Love' },
];

const Confession: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [sortOption, setSortOption] = useState('hot');
  const [topicFilter, setTopicFilter] = useState('all');
  const [confessions, setConfessions] = useState(SAMPLE_CONFESSIONS);
  
  // Check if the user is allowed to access content based on university verification
  const isSchoolVerified = isVerified && user?.university !== null;
  
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
  
  const handleSearchClick = () => {
    navigate('/confession/search');
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
      
      {/* Filter Options - improved appearance and moved closer to header */}
      <div className="flex px-4 py-2 gap-2 bg-white shadow-sm">
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="bg-white rounded-xl border border-cendy-gray-medium h-9 px-3 py-1 text-sm">
            <div className="flex items-center">
              {SORT_OPTIONS.find(opt => opt.id === sortOption)?.icon}
              <SelectValue placeholder="Sort By" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                <div className="flex items-center">
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
        {!isSchoolVerified ? (
          <div className="mt-8 p-4 text-center">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-medium text-cendy-text">Verification Required</h3>
              <p className="text-sm text-cendy-text-secondary">
                You need to verify with your university email to view confessions from your school.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Confession Posts */}
            <div className="space-y-0">
              {confessions.map((confession, index) => (
                <React.Fragment key={confession.id}>
                  <ConfessionPost
                    title={confession.title}
                    content={confession.content}
                    createdAt={formatTimestamp(confession.createdAt)}
                    reactions={confession.reactions}
                    commentCount={confession.commentCount}
                    anonymous={confession.anonymous}
                    topic={confession.topic}
                    onReactionClick={(reactionType) => handleReactionClick(confession.id, reactionType)}
                    onCommentClick={() => handleOpenComments(confession.id)}
                    className="px-4 py-3"
                    fullWidth={true}
                    authorId={confession.id} // Using confession.id as author ID for demo
                  />
                  {index < confessions.length - 1 && (
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
            
            {/* Empty state if no confessions match the filter */}
            {confessions.length === 0 && (
              <div className="mt-8 text-center">
                <p className="text-cendy-text-secondary">No confessions found. Be the first to share!</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Confession;
