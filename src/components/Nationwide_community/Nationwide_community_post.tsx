
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface NationwideCommunityPostProps {
  title?: string;
  content: string;
  authorName: string;
  authorUniversity?: string;
  createdAt: string;
  commentCount: number;
  imageUrl?: string;
  onPostClick: () => void;
  className?: string;
  topic?: string;
  fullWidth?: boolean;
  authorId?: string;
}

const NationwideCommunityPost: React.FC<NationwideCommunityPostProps> = ({
  title,
  content,
  authorName,
  authorUniversity,
  createdAt,
  commentCount,
  imageUrl,
  onPostClick,
  className,
  topic,
  fullWidth = false,
  authorId
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  
  const handlePostClick = () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Only verified users can chat with other users.",
        variant: "default",
      });
      return;
    }
    onPostClick();
  };
  
  const handleReportClick = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our community safe.",
    });
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (authorId) {
      navigate(`/profile/${authorId}`);
    }
  };
  
  const firstLetter = authorName.charAt(0).toUpperCase();
  
  return (
    <div 
      className={cn(
        "bg-white transition-all",
        fullWidth ? "" : "rounded-xl shadow-sm hover-card-effect",
        className
      )}
      onClick={handlePostClick}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2" onClick={handleAuthorClick}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cendy-blue/80 text-sm font-medium text-white cursor-pointer">
            {firstLetter}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-cendy-text cursor-pointer">{authorName}</p>
              {authorUniversity && <span className="text-xs text-cendy-text-secondary">• {authorUniversity}</span>}
            </div>
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
          onClick={(e) => {
            e.stopPropagation();
            handleReportClick();
          }}
          className="text-cendy-text-secondary hover:text-red-500"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      {/* Post Title & Content */}
      {title && <h3 className="font-semibold text-lg mb-2 text-cendy-text">{title}</h3>}
      <div className="mb-2">
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
    </div>
  );
};

export default NationwideCommunityPost;
