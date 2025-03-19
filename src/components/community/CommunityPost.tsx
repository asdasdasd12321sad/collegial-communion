
import React from 'react';
import { MessageCircle, Flag, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface CommunityPostProps {
  content: string;
  authorName: string;
  authorGender: string;
  createdAt: string;
  commentCount: number;
  imageUrl?: string;
  onChatClick: () => void;
  onCommentClick: () => void;
  className?: string;
}

const CommunityPost: React.FC<CommunityPostProps> = ({
  content,
  authorName,
  authorGender,
  createdAt,
  commentCount,
  imageUrl,
  onChatClick,
  onCommentClick,
  className
}) => {
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  
  const handleChatClick = () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can chat with other users.",
        variant: "default",
      });
      return;
    }
    onChatClick();
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cendy-blue/80 text-sm font-medium text-white">
            {firstLetter}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-cendy-text">{authorName}</p>
              <span className="text-xs text-cendy-text-secondary">• {authorGender}</span>
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
      
      {/* Post Content */}
      <div className="mb-4">
        <p className="text-cendy-text mb-3">{content}</p>
        
        {/* Image (if provided) */}
        {imageUrl && (
          <div className="mt-2 mb-2 rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Post attachment" 
              className="w-full h-auto object-cover"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-cendy-gray-medium">
        <button 
          onClick={onCommentClick}
          className="flex items-center gap-1 text-cendy-text-secondary hover:text-cendy-text transition-colors"
        >
          <MessageCircle size={18} />
          <span className="text-sm">{commentCount} Comments</span>
        </button>
        
        <button 
          onClick={handleChatClick}
          className="flex items-center gap-1 text-cendy-blue hover:text-cendy-blue-dark transition-colors"
        >
          <Send size={16} />
          <span className="text-sm">Message</span>
        </button>
      </div>
    </div>
  );
};

export default CommunityPost;
