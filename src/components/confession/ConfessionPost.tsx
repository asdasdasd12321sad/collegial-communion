
import React from 'react';
import { MessageCircle, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ReactionCounts {
  like: number;
  laugh: number;
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

export default ConfessionPost;
