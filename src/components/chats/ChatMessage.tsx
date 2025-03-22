
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  senderName?: string;
  isGroupChat?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  timestamp,
  isCurrentUser,
  senderName,
  isGroupChat = false,
}) => {
  return (
    <div className={cn(
      "flex mb-4",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-2",
        isCurrentUser ? "bg-cendy-blue text-white" : "bg-cendy-gray text-cendy-text"
      )}>
        {isGroupChat && !isCurrentUser && (
          <div className="text-xs font-medium mb-1 text-cendy-blue-dark">{senderName}</div>
        )}
        <p className="break-words">{content}</p>
        <div className={cn(
          "text-xs mt-1",
          isCurrentUser ? "text-white/70 text-right" : "text-cendy-text-secondary"
        )}>
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
