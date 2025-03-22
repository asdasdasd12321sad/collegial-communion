
import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Send, PaperclipIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ChatMessage from '@/components/chats/ChatMessage';

// Mock data for a private chat
const MOCK_PRIVATE_CHAT = {
  id: 'private-1',
  name: "Jamie Wilson",
  messages: [
    {
      id: 'p1',
      content: "Hey! I saw your post about looking for a study partner for the upcoming finals.",
      sender: "Jamie Wilson",
      timestamp: "Yesterday, 4:30 PM",
      isCurrentUser: false
    },
    {
      id: 'p2',
      content: "Hi Jamie! Yes, I'm looking for someone to study with for the computer science final.",
      sender: "Current User",
      timestamp: "Yesterday, 4:45 PM",
      isCurrentUser: true
    },
    {
      id: 'p3',
      content: "That's perfect! I'm also in CS101. When are you planning to start?",
      sender: "Jamie Wilson",
      timestamp: "Yesterday, 5:00 PM",
      isCurrentUser: false
    },
    {
      id: 'p4',
      content: "I was thinking this weekend? Maybe Saturday afternoon at the library?",
      sender: "Current User",
      timestamp: "Yesterday, 5:10 PM",
      isCurrentUser: true
    },
    {
      id: 'p5',
      content: "Saturday works for me. Let's meet at 2pm in the main library, second floor?",
      sender: "Jamie Wilson",
      timestamp: "Yesterday, 5:15 PM",
      isCurrentUser: false
    }
  ]
};

const MessagesPrivate: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [privateChat] = useState(MOCK_PRIVATE_CHAT);
  
  const handleBack = () => {
    navigate('/messages');
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // In a real app, this would send the message to the backend
    console.log("Sending private message:", newMessage);
    
    // Clear the input after sending
    setNewMessage("");
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
          <div className="flex items-center">
            <h1 className="text-base font-medium text-cendy-text">{privateChat.name}</h1>
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
          {privateChat.messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              isCurrentUser={message.isCurrentUser}
            />
          ))}
        </div>
      </main>
      
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
      
      <BottomNavigation />
    </div>
  );
};

export default MessagesPrivate;
