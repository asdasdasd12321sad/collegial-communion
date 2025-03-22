
import React, { useState } from 'react';
import { MoreHorizontal, Save, EyeOff, Flag, Pencil, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
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
  currentUserId?: string;
  onEdit?: () => void;
  onDelete?: () => void;
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
  authorId,
  currentUserId,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const isOwner = authorId === currentUserId || authorId === user?.id;
  
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
