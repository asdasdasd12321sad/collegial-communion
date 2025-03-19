
import React from 'react';
import { MessageCircle, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface ReactionCounts {
  like: number;
  laugh: number;
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
        <div className="flex gap-2">
          <button 
            onClick={() => handleReactionClick('like')} 
            className="reaction-btn"
          >
            👍 {reactions.like}
          </button>
          <button 
            onClick={() => handleReactionClick('laugh')} 
            className="reaction-btn"
          >
            😂 {reactions.laugh}
          </button>
          <button 
            onClick={() => handleReactionClick('sad')} 
            className="reaction-btn"
          >
            😢 {reactions.sad}
          </button>
          <button 
            onClick={() => handleReactionClick('angry')} 
            className="reaction-btn"
          >
            😡 {reactions.angry}
          </button>
        </div>
        
        <button 
          onClick={onCommentClick}
          className="flex items-center gap-1 text-cendy-text-secondary"
        >
          <MessageCircle size={18} />
          <span className="text-sm">{commentCount}</span>
        </button>
      </div>
      
      {/* Reaction button styles */}
      <style jsx>{`
        .reaction-btn {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 4px 8px;
          border-radius: 16px;
          background-color: #f7f7f7;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        
        .reaction-btn:hover {
          background-color: #e6e6e6;
        }
      `}</style>
    </div>
  );
};

export default ForumPost;
