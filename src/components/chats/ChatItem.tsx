
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatItemProps {
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isGroupChat?: boolean;
  onClick: () => void;
  isActive?: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({
  name,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isGroupChat = false,
  onClick,
  isActive = false,
}) => {
  const firstLetter = name.charAt(0).toUpperCase();
  
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-cendy-gray transition-colors",
        isActive && "bg-cendy-gray"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full text-white",
        isGroupChat ? "bg-cendy-blue-light" : "bg-cendy-blue"
      )}>
        {isGroupChat ? (
          <div className="text-lg font-medium">#</div>
        ) : (
          <div className="text-lg font-medium">{firstLetter}</div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium text-cendy-text truncate">{name}</h3>
          <span className="text-xs text-cendy-text-secondary">{timestamp}</span>
        </div>
        <p className="text-sm text-cendy-text-secondary truncate">{lastMessage}</p>
      </div>
      
      {unreadCount > 0 && (
        <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-cendy-blue text-xs text-white">
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default ChatItem;
