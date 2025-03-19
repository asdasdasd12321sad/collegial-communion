
import React, { useState } from 'react';
import { MessageCircle, Flag, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const [isHovered, setIsHovered] = useState(false);
  
  const handleReactionClick = (type: string) => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can react to posts.",
        variant: "default",
      });
      return;
    }
    onReactionClick(type);
  };
  
  const handleReportClick = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our community safe.",
    });
  };
  
  const formattedTime = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const firstLetter = authorName.charAt(0).toUpperCase();
  
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
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="reaction-display flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
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
                    <span className="text-sm text-cendy-text-secondary">{totalReactions}</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp size={16} className="text-cendy-text-secondary" />
                    <span className="text-sm text-cendy-text-secondary">React</span>
                  </>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1 bg-white shadow-lg rounded-full border-none">
              <div className="flex space-x-1 px-1">
                {Object.entries(reactionEmojis).map(([type, emoji]) => (
                  <button
                    key={type}
                    onClick={() => handleReactionClick(type)}
                    className="reaction-button p-2 hover:bg-gray-100 rounded-full transition-transform hover:scale-125"
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

export default ForumPost;
