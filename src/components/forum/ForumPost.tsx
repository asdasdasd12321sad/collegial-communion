
import React, { useState, useRef } from 'react';
import { MessageCircle, MoreHorizontal, ThumbsUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
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
  topic?: string;
  fullWidth?: boolean;
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
  className,
  topic,
  fullWidth = false
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
      "bg-white transition-all",
      fullWidth ? "border-b border-cendy-gray-medium" : "rounded-xl shadow-sm hover-card-effect",
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
            <div className="flex items-center gap-1">
              {topic && (
                <Badge variant="secondary" className="text-xs bg-cendy-gray text-cendy-text-secondary py-0 px-1 h-4">
                  {topic}
                </Badge>
              )}
              <p className="text-xs text-cendy-text-secondary">{createdAt}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={handleReportClick}
          className="text-cendy-text-secondary hover:text-red-500"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      {/* Post Title & Content */}
      <h3 className="font-semibold text-lg mb-2 text-cendy-text">{title}</h3>
      <div className="mb-3">
        <p className="text-cendy-text">{content}</p>
      </div>
      
      {/* Reactions & Comments */}
      <div className="flex items-center justify-between pt-2 border-t border-cendy-gray-medium">
        {/* Reaction count & icons */}
        <div className="flex items-center">
          {topReactions.length > 0 && (
            <div className="flex items-center mr-2">
              <div className="flex">
                {topReactions.map(([type, _], index) => (
                  <span key={type} className="text-sm" style={{ marginLeft: index > 0 ? '-2px' : '0' }}>
                    {reactionEmojis[type]}
                  </span>
                ))}
              </div>
              {totalReactions > 0 && (
                <span className="text-xs text-cendy-text-secondary ml-1">{totalReactions}</span>
              )}
            </div>
          )}
          
          {/* Comment count */}
          {commentCount > 0 && (
            <button 
              onClick={onCommentClick}
              className="flex items-center text-cendy-text-secondary text-xs"
            >
              <span>{commentCount} comments</span>
            </button>
          )}
        </div>
        
        {/* Reaction button */}
        <div ref={likeButtonRef} className="relative">
          <ReactionButton
            icon={getReactionIcon()}
            text={getReactionText()}
            active={!!userReaction}
            activeColor={getReactionColor()}
            onClick={handleLikeClick}
            onLongPress={handleLongPress}
          />
          
          <ReactionPopover
            isOpen={showReactionPopover}
            onReactionSelect={handleReaction}
            onClose={() => setShowReactionPopover(false)}
            triggerRef={likeButtonRef}
            currentReaction={userReaction}
          />
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
