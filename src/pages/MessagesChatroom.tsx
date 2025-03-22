
import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Send, PaperclipIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ChatMessage from '@/components/chats/ChatMessage';

// Mock data for a group chat
const MOCK_CHATROOM = {
  id: 'chatroom-1',
  name: "Biology 101 Study Group",
  description: "Group chat for Biology 101 final exam prep",
  createdBy: "Alex",
  members: ["Alex", "Jamie", "Riley", "Jordan"],
  messages: [
    {
      id: 'm1',
      content: "Hey everyone! I created this group for our Bio 101 final exam prep. Who's going to the study session tomorrow?",
      sender: "Alex",
      timestamp: "2:45 PM",
      isCurrentUser: false
    },
    {
      id: 'm2',
      content: "I'll be there! Should we bring the lab notes too?",
      sender: "Jamie",
      timestamp: "2:50 PM",
      isCurrentUser: false
    },
    {
      id: 'm3',
      content: "Yeah, definitely bring the lab notes. I'm still confused about the enzyme experiment.",
      sender: "Riley",
      timestamp: "2:55 PM",
      isCurrentUser: true
    },
    {
      id: 'm4',
      content: "I can help with that! I got full marks on that part of the lab.",
      sender: "Alex",
      timestamp: "3:01 PM",
      isCurrentUser: false
    },
    {
      id: 'm5',
      content: "That would be great, thanks! I'm also bringing some sample questions I found.",
      sender: "Riley",
      timestamp: "3:05 PM",
      isCurrentUser: true
    }
  ]
};

const MessagesChatroom: React.FC = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [chatroom] = useState(MOCK_CHATROOM);
  const [isMember, setIsMember] = useState(true);
  
  const handleBack = () => {
    navigate('/messages');
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // In a real app, this would send the message to the backend
    console.log("Sending message:", newMessage);
    
    // Clear the input after sending
    setNewMessage("");
  };
  
  const handleJoin = () => {
    setIsMember(true);
    // In a real app, this would add the user to the chatroom members
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header 
        leftElement={
          <button onClick={handleBack} className="text-cendy-text">
            <ArrowLeft size={20} />
          </button>
        }
        centerElement={
          <div className="flex flex-col items-center">
            <h1 className="text-base font-medium text-cendy-text">{chatroom.name}</h1>
            <span className="text-xs text-cendy-text-secondary">{chatroom.members.length} members</span>
          </div>
        }
        rightElement={
          <button className="text-cendy-text">
            <MoreVertical size={20} />
          </button>
        }
      />
      
      <main className="flex-1 p-4 pb-20 overflow-y-auto">
        <div className="space-y-4">
          {chatroom.messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              isCurrentUser={message.isCurrentUser}
              senderName={message.sender}
              isGroupChat={true}
            />
          ))}
        </div>
      </main>
      
      {isMember ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cendy-gray-medium p-2 pb-safe-area-bottom">
          <div className="flex items-center gap-2">
            <button className="text-cendy-text-secondary p-2">
              <PaperclipIcon size={20} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-cendy-gray rounded-full px-4 py-2 text-sm focus:outline-none"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-cendy-blue text-white p-2 rounded-full"
              disabled={newMessage.trim() === ""}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cendy-gray-medium p-4 pb-safe-area-bottom">
          <button 
            onClick={handleJoin}
            className="w-full bg-cendy-blue text-white py-3 rounded-xl font-medium"
          >
            Join Chatroom
          </button>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default MessagesChatroom;
