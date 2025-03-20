
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ThumbsUp } from 'lucide-react';

// Define reaction types
type ReactionType = 'like' | 'heart' | 'laugh' | 'wow' | 'sad' | 'angry' | null;

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

interface ReactionOption {
  type: ReactionType;
  emoji: string;
  label: string;
}

// Define the available reactions
const REACTION_OPTIONS: ReactionOption[] = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'heart', emoji: '❤️', label: 'Love' },
  { type: 'laugh', emoji: '😆', label: 'Haha' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😡', label: 'Angry' },
];

const ReactionButton: React.FC<ReactionButtonProps> = ({
  reactions,
  isVerified,
  onReactionClick,
  className
}) => {
  const [userReaction, setUserReaction] = useState<ReactionType>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<ReactionType>(null);
  
  // Long press timer and tracking
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressDuration = 500; // ms
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Handle reaction selection
  const handleReactionSelect = useCallback((reaction: ReactionType) => {
    if (!isVerified) return;
    
    // Toggle reaction off if it's already selected
    if (reaction === userReaction) {
      setUserReaction(null);
      onReactionClick('remove');
    } else {
      setUserReaction(reaction);
      onReactionClick(reaction as string);
    }
    
    closeReactionMenu();
  }, [isVerified, userReaction, onReactionClick]);
  
  // Open the reaction menu
  const openReactionMenu = useCallback(() => {
    if (!isVerified) return;
    setIsMenuOpen(true);
    
    // Trigger vibration if supported
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, [isVerified]);
  
  // Close the reaction menu
  const closeReactionMenu = useCallback(() => {
    setIsMenuOpen(false);
    setHoveredReaction(null);
    setIsDragging(false);
  }, []);
  
  // Handle mouse/touch down
  const handlePointerDown = useCallback(() => {
    if (!isVerified) return;
    
    // Start a timer for long press detection
    longPressTimer.current = setTimeout(() => {
      openReactionMenu();
      setIsDragging(true);
    }, longPressDuration);
  }, [isVerified, openReactionMenu]);
  
  // Handle mouse/touch move
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isMenuOpen && menuRef.current && isDragging) {
      const menu = menuRef.current;
      const menuRect = menu.getBoundingClientRect();
      
      // Check if pointer is inside menu
      if (
        e.clientX >= menuRect.left &&
        e.clientX <= menuRect.right &&
        e.clientY >= menuRect.top &&
        e.clientY <= menuRect.bottom
      ) {
        // Calculate which reaction option is being hovered
        const relativeX = e.clientX - menuRect.left;
        const optionWidth = menuRect.width / REACTION_OPTIONS.length;
        const optionIndex = Math.floor(relativeX / optionWidth);
        const boundedIndex = Math.max(0, Math.min(optionIndex, REACTION_OPTIONS.length - 1));
        
        setHoveredReaction(REACTION_OPTIONS[boundedIndex].type);
      } else {
        setHoveredReaction(null);
      }
    }
  }, [isMenuOpen, isDragging]);
  
  // Handle mouse/touch up
  const handlePointerUp = useCallback(() => {
    if (!isVerified) return;
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    if (isMenuOpen) {
      // If menu is open, select the currently hovered reaction
      if (hoveredReaction) {
        handleReactionSelect(hoveredReaction);
      } else {
        closeReactionMenu();
      }
    } else {
      // If it was a quick tap, toggle the like reaction
      handleReactionSelect(userReaction === 'like' ? null : 'like');
    }
    
    setIsDragging(false);
  }, [isVerified, isMenuOpen, hoveredReaction, userReaction, handleReactionSelect, closeReactionMenu]);
  
  // Handle pointer cancel/leave
  const handlePointerCancel = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);
  
  // Click outside handler to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node) && 
        isMenuOpen
      ) {
        closeReactionMenu();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, closeReactionMenu]);
  
  // Get the two most popular reactions
  const getTopReactions = () => {
    return Object.entries(reactions)
      .sort(([, countA], [, countB]) => countB - countA)
      .filter(([, count]) => count > 0)
      .slice(0, 2);
  };
  
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
  const topReactions = getTopReactions();
  
  // Get emoji for a reaction type
  const getEmojiForReaction = (type: string): string => {
    const reaction = REACTION_OPTIONS.find(r => r.type === type);
    return reaction ? reaction.emoji : '👍';
  };
  
  // Get color for selected reaction
  const getReactionColor = (reaction: ReactionType): string => {
    switch (reaction) {
      case 'like': return 'text-blue-500 bg-blue-50';
      case 'heart': return 'text-red-500 bg-red-50';
      case 'laugh':
      case 'wow':
      case 'sad': return 'text-yellow-500 bg-yellow-50';
      case 'angry': return 'text-orange-500 bg-orange-50';
      default: return 'text-cendy-text-secondary';
    }
  };
  
  // Dynamic button className
  const buttonClassName = cn(
    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
    userReaction ? getReactionColor(userReaction) : "text-cendy-text-secondary hover:bg-gray-100",
    className
  );
  
  return (
    <div className="relative">
      {/* Reaction menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white p-2 rounded-full shadow-lg z-50 animate-scale-in"
        >
          {REACTION_OPTIONS.map((reaction) => (
            <button
              key={reaction.type}
              className={cn(
                "relative p-2 rounded-full transition-all hover:scale-125",
                hoveredReaction === reaction.type && "scale-125 bg-gray-100"
              )}
              onMouseEnter={() => setHoveredReaction(reaction.type)}
              onMouseLeave={() => setHoveredReaction(null)}
              onClick={() => handleReactionSelect(reaction.type)}
            >
              <span className="text-2xl">{reaction.emoji}</span>
              {hoveredReaction === reaction.type && (
                <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                  {reaction.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Main reaction button */}
      <button 
        ref={buttonRef}
        className={buttonClassName}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerCancel}
        onPointerCancel={handlePointerCancel}
        onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long press
      >
        {topReactions.length > 0 ? (
          <>
            <div className="flex -space-x-1">
              {topReactions.map(([type]) => (
                <span key={type} className="text-xl">
                  {getEmojiForReaction(type)}
                </span>
              ))}
            </div>
            <span className={cn(
              "text-sm",
              userReaction ? getReactionColor(userReaction).split(' ')[0] : "text-cendy-text-secondary"
            )}>
              {totalReactions}
            </span>
          </>
        ) : (
          <>
            {userReaction ? (
              <span className="text-xl mr-1">{getEmojiForReaction(userReaction)}</span>
            ) : (
              <ThumbsUp 
                size={18} 
                className={userReaction === 'like' ? "fill-current" : ""} 
              />
            )}
            <span className="text-sm">
              {userReaction ? REACTION_OPTIONS.find(r => r.type === userReaction)?.label : 'React'}
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default ReactionButton;
