
import React, { useState, useRef, useCallback } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  const [isDragging, setIsDragging] = useState(false);
  
  const reactionEmojis: Record<string, string> = {
    like: '👍',
    heart: '❤️',
    laugh: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😡'
  };

  const handleReactionSelect = useCallback((type: string) => {
    if (!isVerified) return;
    
    if (userReaction === type) {
      setUserReaction(null);
      onReactionClick('remove');
    } else {
      setUserReaction(type);
      onReactionClick(type);
    }
    setIsOpen(false);
  }, [isVerified, userReaction, onReactionClick]);

  const handleButtonMouseDown = useCallback(() => {
    if (!isVerified) return;
    
    longPressTimerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 500);
  }, [isVerified]);

  const handleButtonMouseUp = useCallback(() => {
    if (!isVerified) return;

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
      
      if (!isOpen && !isDragging) {
        handleReactionSelect(userReaction === 'like' ? 'remove' : 'like');
      }
    }
    setIsDragging(false);
  }, [isVerified, isOpen, isDragging, userReaction, handleReactionSelect]);

  const handleButtonMouseLeave = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Get the two most popular reactions
  const getTopReactions = () => {
    return Object.entries(reactions)
      .sort(([, countA], [, countB]) => countB - countA)
      .filter(([, count]) => count > 0)
      .slice(0, 2);
  };

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
  const topReactions = getTopReactions();
  
  const buttonClassName = cn(
    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
    userReaction ? "text-cendy-blue bg-cendy-blue/10" : "text-cendy-text-secondary hover:bg-gray-100",
    className
  );

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button 
            className={buttonClassName}
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
                    <span key={type} className="text-xl">
                      {reactionEmojis[type]}
                    </span>
                  ))}
                </div>
                <span className={cn(
                  "text-sm",
                  userReaction ? "text-cendy-blue" : "text-cendy-text-secondary"
                )}>{totalReactions}</span>
              </>
            ) : (
              <>
                <ThumbsUp 
                  size={18} 
                  className={cn(
                    "transition-transform",
                    userReaction === 'like' && "fill-current"
                  )} 
                />
                <span className="text-sm">React</span>
              </>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-2 bg-white shadow-lg rounded-full border-none"
          sideOffset={5}
          align="center"
          side="top"
        >
          <div className="flex gap-1">
            {Object.entries(reactionEmojis).map(([type, emoji]) => (
              <button
                key={type}
                onClick={() => handleReactionSelect(type)}
                className={cn(
                  "p-2 rounded-full transition-all hover:scale-125",
                  userReaction === type ? "bg-cendy-blue/10 scale-125" : "hover:bg-gray-100"
                )}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
              >
                <span className="text-2xl">{emoji}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ReactionButton;
