import React, { useState, useRef } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface ReactionCounts {
  like: number;
  heart: number;
  laugh: number;
  wow: number;
  sad: number;
  angry: number;
}

interface ReactionButtonProps {
  reactions: ReactionCounts;
  isVerified: boolean;
  onReactionClick: (reactionType: string) => void;
  className?: string;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  reactions,
  isVerified,
  onReactionClick,
  className
}) => {
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Map reaction types to emojis
  const reactionEmojis: Record<string, string> = {
    like: '👍',
    heart: '❤️',
    laugh: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😡'
  };
  
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
    
    longPressTimerRef.current = timer;
  };
  
  const handleButtonMouseUp = () => {
    if (!isVerified) return;
    
    // If the timer exists and hasn't triggered yet
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
      
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
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };
  
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
  
  // Use Cendy blue when user has reacted
  const reactionColor = userReaction ? 'text-cendy-blue' : 'text-cendy-text-secondary';
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
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
      
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default ReactionButton;
