import React, { useState, useRef } from 'react';
import { MessageCircle, MoreHorizontal, ThumbsUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ReactionButton from "@/components/ui/reaction-button";
import ReactionPopover, { ReactionType } from "@/components/ui/reaction-popover";
import { Badge } from "@/components/ui/badge";

interface ReactionCounts {
  like: number;
  heart: number;
  laugh: number;
  wow: number;
  sad: number;
  angry: number;
}

interface ConfessionPostProps {
  title: string;
  content: string;
  createdAt: string;
  reactions: ReactionCounts;
  commentCount: number;
  onReactionClick: (reactionType: string) => void;
  onCommentClick: () => void;
  className?: string;
  topic?: string;
  fullWidth?: boolean;
  authorId?: string;
}

const ConfessionPost: React.FC<ConfessionPostProps> = ({
  title,
  content,
  createdAt,
  reactions,
  commentCount,
  onReactionClick,
  onCommentClick,
  className,
  topic,
  fullWidth = false,
  authorId
}) => {
  const navigate = useNavigate();
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
    
    if (userReaction === reaction) {
      setUserReaction(null);
      onReactionClick('remove');
    } else {
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

  const handleAuthorClick = () => {
    if (authorId) {
      navigate(`/profile/${authorId}`);
    }
  };
  
  const getTopReactions = () => {
    const sortedReactions = Object.entries(reactions)
      .sort(([, countA], [, countB]) => countB - countA)
      .filter(([, count]) => count > 0)
      .slice(0, 2);
    
    return sortedReactions;
  };
  
  const topReactions = getTopReactions();
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
  
  const reactionEmojis: Record<string, string> = {
    like: '👍',
    heart: '❤️',
    laugh: '😆',
    wow: '😮',
    sad: '😢',
    angry: '😡'
  };
  
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
  
  return (
    <div className={cn(
      "bg-white transition-all",
      fullWidth ? "" : "rounded-xl shadow-sm hover-card-effect",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2" onClick={handleAuthorClick}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cendy-blue/80 text-sm font-medium text-white cursor-pointer">
            {user?.displayName?.[0] || '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-cendy-text cursor-pointer">
              {user?.displayName || 'User'}
            </p>
            <div className="flex items-center gap-1">
              {topic && (
                <Badge variant="secondary" className="text-xs text-cendy-blue bg-transparent py-0 px-1 h-4">
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
      
      <h3 className="font-semibold text-lg mb-2 text-cendy-text cursor-pointer" onClick={onCommentClick}>{title}</h3>
      <div className="mb-2">
        <p className="text-cendy-text cursor-pointer" onClick={onCommentClick}>{content}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {topReactions.length > 0 && (
            <div className="flex items-center">
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
          
          {commentCount > 0 && (
            <div className="flex items-center text-cendy-text-secondary ml-3">
              <MessageCircle size={14} className="mr-1" />
              <span className="text-xs">{commentCount}</span>
            </div>
          )}
        </div>
        
        <div ref={likeButtonRef} className="relative ml-auto mr-2">
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

export default ConfessionPost;
