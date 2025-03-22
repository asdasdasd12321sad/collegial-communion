
import React, { useState, useRef } from 'react';
import { MessageCircle, MoreHorizontal, ThumbsUp, Save, EyeOff, Flag, Pencil, Trash } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ReactionButton from "@/components/ui/reaction-button";
import ReactionPopover, { ReactionType } from "@/components/ui/reaction-popover";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  currentUserId?: string;
  onEdit?: () => void;
  onDelete?: () => void;
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
  authorId,
  currentUserId,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [userReaction, setUserReaction] = useState<ReactionType>(null);
  const [showReactionPopover, setShowReactionPopover] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const likeButtonRef = useRef<HTMLDivElement>(null);
  
  const isOwner = authorId === currentUserId || authorId === user?.id;
  
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

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Post Saved",
      description: "This post has been saved to your bookmarks.",
    });
  };

  const handleHidePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Post Hidden",
      description: "This post has been hidden from your feed.",
    });
  };
  
  const handleReportPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our community safe.",
    });
  };

  const handleEditPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    } else {
      toast({
        title: "Edit Post",
        description: "This feature is coming soon!",
      });
    }
  };

  const handleDeletePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    } else {
      setIsDeleteConfirmOpen(false);
      toast({
        title: "Post Deleted",
        description: "Your post has been successfully deleted.",
      });
    }
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="text-cendy-text-secondary hover:text-cendy-text">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white">
            <DropdownMenuItem onClick={handleSavePost}>
              <Save size={16} className="mr-2" />
              <span>Save post</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleHidePost}>
              <EyeOff size={16} className="mr-2" />
              <span>Hide post</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReportPost}>
              <Flag size={16} className="mr-2" />
              <span>Report post</span>
            </DropdownMenuItem>
            
            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEditPost}>
                  <Pencil size={16} className="mr-2" />
                  <span>Edit post</span>
                </DropdownMenuItem>
                <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteConfirmOpen(true);
                      }}
                    >
                      <Trash size={16} className="mr-2" />
                      <span>Delete post</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePost} className="bg-red-500 hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
