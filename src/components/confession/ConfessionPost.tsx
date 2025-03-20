import React, { useState } from 'react';
import { MessageCircle, Flag, Heart, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ReactionCounts {
  like: number;
  heart: number;
  laugh: number;
  wow: number;
  sad: number;
  angry: number;
}

interface ConfessionPostProps {
  content: string;
  createdAt: string;
  reactions: ReactionCounts;
  commentCount: number;
  anonymous: boolean;
  onReactionClick: (reactionType: string) => void;
  onCommentClick: () => void;
  className?: string;
}

const ConfessionPost: React.FC<ConfessionPostProps> = ({
  content,
  createdAt,
  reactions,
  commentCount,
  anonymous,
  onReactionClick,
  onCommentClick,
  className
}) => {
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  const handleReactionClick = (type: string) => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can react to posts.",
        variant: "default",
      });
      return;
    }
    
    // If user already reacted with this type, remove the reaction
    if (userReaction === type) {
      setUserReaction(null);
      onReactionClick('remove');
    } else {
      // Set the user's reaction
      setUserReaction(type);
      onReactionClick(type);
    }
    
    setIsOpen(false);
  };
  
  const handleButtonMouseDown = () => {
    if (!isVerified) return;
    
    // Start a timer for long press detection
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // 500ms is a good threshold for "slightly hold"
    
    setLongPressTimer(timer);
  };
  
  const handleButtonMouseUp = () => {
    if (!isVerified) return;
    
    // If the timer exists and hasn't triggered yet
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
      
      // If the popover isn't open, this was a quick tap
      if (!isOpen) {
        // If they already reacted with like, remove it
        if (userReaction === 'like') {
          handleReactionClick('like'); // This will remove the reaction
        } else {
          // Otherwise add a like
          handleReactionClick('like');
        }
      }
    }
  };
  
  const handleButtonMouseLeave = () => {
    // Clear the timer if the user moves away
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };
  
  const handleReportClick = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our community safe.",
    });
  };
  
  const formattedTime = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  // Get the two most popular reactions
  const getTopReactions = () => {
    const sortedReactions = Object.entries(reactions)
      .sort(([, countA], [, countB]) => countB - countA)
      .filter(([, count]) => count > 0)
      .slice(0, 2);
    
    return sortedReactions;
  };
  
  const topReactions = getTopReactions();
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
  
  // Map reaction types to emojis
  const reactionEmojis: Record<string, string> = {
    like: '👍',
    heart: '❤️',
    laugh: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😡'
  };
  
  // Single color for all reactions - using Cendy blue
  const reactionColor = userReaction ? 'text-cendy-blue' : 'text-cendy-text-secondary';
  
  return (
    <div className={cn(
      "bg-white rounded-xl p-4 shadow-sm transition-all hover-card-effect",
      className
    )}>
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cendy-blue/80 text-sm font-medium text-white">
            {anonymous ? '?' : user?.displayName?.[0] || '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-cendy-text">
              {anonymous ? 'Anonymous' : user?.displayName || 'User'}
            </p>
            <p className="text-xs text-cendy-text-secondary">{formattedTime}</p>
          </div>
        </div>
        <button 
          onClick={handleReportClick}
          className="text-cendy-text-secondary hover:text-red-500"
        >
          <Flag size={16} />
        </button>
      </div>
      
      {/* Post Content */}
      <div className="mb-4">
        <p className="text-cendy-text">{content}</p>
      </div>
      
      {/* Reactions & Comments */}
      <div className="flex items-center justify-between pt-2 border-t border-cendy-gray-medium">
        <div className="flex items-center gap-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button 
                className={`reaction-display flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 ${reactionColor}`}
                onMouseDown={handleButtonMouseDown}
                onMouseUp={handleButtonMouseUp}
                onTouchStart={handleButtonMouseDown}
                onTouchEnd={handleButtonMouseUp}
                onMouseLeave={handleButtonMouseLeave}
              >
                {topReactions.length > 0 ? (
                  <>
                    <div className="flex -space-x-1">
                      {topReactions.map(([type]) => (
                        <span key={type} className="reaction-emoji">
                          {reactionEmojis[type]}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm">{totalReactions}</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp size={16} />
                    <span className="text-sm">React</span>
                  </>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto p-1 bg-white shadow-lg rounded-full border-none" 
              sideOffset={5}
              align="start"
              side="top"
            >
              <div className="flex space-x-1 px-1">
                {Object.entries(reactionEmojis).map(([type, emoji]) => (
                  <button
                    key={type}
                    onClick={() => handleReactionClick(type)}
                    className={`reaction-button p-2 hover:bg-gray-100 rounded-full transition-transform hover:scale-125 ${userReaction === type ? 'bg-gray-100 scale-125' : ''}`}
                    title={type.charAt(0).toUpperCase() + type.slice(1)}
                  >
                    <span className="text-xl">{emoji}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <button 
          onClick={onCommentClick}
          className="flex items-center gap-1 text-cendy-text-secondary"
        >
          <MessageCircle size={18} />
          <span className="text-sm">{commentCount}</span>
        </button>
      </div>
      
      <style>
        {`
          .reaction-emoji {
            font-size: 1.2rem;
          }
          
          .reaction-button {
            cursor: pointer;
            transition: transform 0.2s;
          }
          
          .reaction-button:hover {
            transform: scale(1.2);
          }
        `}
      </style>
    </div>
  );
};

export default ConfessionPost;
