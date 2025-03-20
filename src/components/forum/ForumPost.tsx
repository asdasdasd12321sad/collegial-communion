
import React, { useState, useRef } from 'react';
import { MessageCircle, Flag, ThumbsUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import ReactionButton from "@/components/ui/reaction-button";
import ReactionPopover, { ReactionType } from "@/components/ui/reaction-popover";

interface ReactionCounts {
  like: number;
  heart: number;
  laugh: number;
  wow: number;
  sad: number;
  angry: number;
}

interface ForumPostProps {
  title: string;
  content: string;
  authorName: string;
  authorSchool: string;
  createdAt: string;
  reactions: ReactionCounts;
  commentCount: number;
  tags: string[];
  onReactionClick: (reactionType: string) => void;
  onCommentClick: () => void;
  className?: string;
}

const ForumPost: React.FC<ForumPostProps> = ({
  title,
  content,
  authorName,
  authorSchool,
  createdAt,
  reactions,
  commentCount,
  tags,
  onReactionClick,
  onCommentClick,
  className
}) => {
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [userReaction, setUserReaction] = useState<ReactionType>(null);
  const [showReactionPopover, setShowReactionPopover] = useState(false);
  const likeButtonRef = useRef<HTMLDivElement>(null);
  
  const handleReaction = (reaction: ReactionType) => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can react to posts.",
        variant: "default",
      });
      return;
    }
    
    // If the same reaction is selected, remove it
    if (userReaction === reaction) {
      setUserReaction(null);
      onReactionClick('remove');
    } else {
      // Set the user's reaction
      setUserReaction(reaction);
      onReactionClick(reaction || 'like');
    }
  };
  
  const handleLikeClick = () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can react to posts.",
        variant: "default",
      });
      return;
    }
    
    // Toggle like reaction
    if (userReaction === 'like') {
      setUserReaction(null);
      onReactionClick('remove');
    } else {
      setUserReaction('like');
      onReactionClick('like');
    }
  };
  
  const handleLongPress = () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can react to posts.",
        variant: "default",
      });
      return;
    }
    
    setShowReactionPopover(true);
  };
  
  const handleReportClick = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our community safe.",
    });
  };
  
  const formattedTime = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const firstLetter = authorName.charAt(0).toUpperCase();
  
  const getReactionIcon = () => {
    switch (userReaction) {
      case "like":
        return <ThumbsUp size={16} />;
      case "heart":
        return <span className="text-lg">❤️</span>;
      case "laugh":
        return <span className="text-lg">😆</span>;
      case "wow":
        return <span className="text-lg">😮</span>;
      case "sad":
        return <span className="text-lg">😢</span>;
      case "angry":
        return <span className="text-lg">😡</span>;
      default:
        return <ThumbsUp size={16} />;
    }
  };

  const getReactionText = () => {
    if (!userReaction) return "React";
    return userReaction.charAt(0).toUpperCase() + userReaction.slice(1);
  };

  const getReactionColor = () => {
    switch (userReaction) {
      case "like":
        return "text-cendy-blue";
      case "heart":
        return "text-red-500";
      case "laugh":
      case "wow":
        return "text-yellow-500";
      case "sad":
        return "text-blue-500";
      case "angry":
        return "text-orange-600";
      default:
        return "";
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
  
  // Map reaction types to emojis
  const reactionEmojis: Record<string, string> = {
    like: '👍',
    heart: '❤️',
    laugh: '😆',
    wow: '😮',
    sad: '😢',
    angry: '😡'
  };
  
  return (
    <div className={cn(
      "bg-white rounded-xl p-4 shadow-sm transition-all hover-card-effect",
      className
    )}>
      {/* Post Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cendy-blue/80 text-sm font-medium text-white">
            {firstLetter}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-cendy-text">{authorName}</p>
              <span className="text-xs text-cendy-text-secondary">• {authorSchool}</span>
            </div>
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
      
      {/* Post Title & Content */}
      <h3 className="font-semibold text-lg mb-2 text-cendy-text">{title}</h3>
      <div className="mb-3">
        <p className="text-cendy-text">{content}</p>
      </div>
      
      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs bg-cendy-gray text-cendy-text-secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Reactions & Comments */}
      <div className="flex items-center justify-between pt-2 border-t border-cendy-gray-medium">
        <div ref={likeButtonRef} className="flex-1 relative">
          <ReactionButton
            icon={getReactionIcon()}
            text={getReactionText()}
            active={!!userReaction}
            activeColor={getReactionColor()}
            onClick={handleLikeClick}
            onLongPress={handleLongPress}
            className="w-full"
          />
          
          <ReactionPopover
            isOpen={showReactionPopover}
            onReactionSelect={handleReaction}
            onClose={() => setShowReactionPopover(false)}
            triggerRef={likeButtonRef}
            currentReaction={userReaction}
          />
        </div>
        
        <button 
          onClick={onCommentClick}
          className="flex items-center gap-1 text-cendy-text-secondary px-2 py-1"
        >
          <MessageCircle size={18} />
          <span className="text-sm">{commentCount}</span>
        </button>
      </div>
    </div>
  );
};

export default ForumPost;
