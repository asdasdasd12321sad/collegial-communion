
import React, { useState } from 'react';
import { ArrowLeft, MoreHorizontal, Send, Smile } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import ChatMessage from '@/components/chats/ChatMessage';
import BottomNavigation from '@/components/layout/BottomNavigation';

// Mock data for a direct chat
const MOCK_DIRECT_CHAT = {
  id: 'direct-1',
  name: "Jamie Wilson",
  messages: [
    { id: 'msg-1', content: "Hey, do you have notes from today's lecture?", senderId: 'other-user', timestamp: '11:30 AM', isCurrentUser: false },
    { id: 'msg-2', content: "Yes, I can share them with you. Give me a minute to find my notebook.", senderId: 'current-user', timestamp: '11:32 AM', isCurrentUser: true },
    { id: 'msg-3', content: "Thanks! I missed some parts when my laptop died.", senderId: 'other-user', timestamp: '11:33 AM', isCurrentUser: false },
    { id: 'msg-4', content: "No problem! Here they are. Let me know if you need any clarification.", senderId: 'current-user', timestamp: '11:45 AM', isCurrentUser: true },
    { id: 'msg-5', content: "These are perfect. Are you going to the study group on Saturday?", senderId: 'other-user', timestamp: '11:47 AM', isCurrentUser: false },
    { id: 'msg-6', content: "Yes, planning to be there. Meet at the library?", senderId: 'current-user', timestamp: '11:50 AM', isCurrentUser: true }
  ]
};

const MessagesPrivate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  
  // Get direct chat data (would come from API in a real app)
  const directChat = MOCK_DIRECT_CHAT;
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleInfoClick = () => {
    // Navigate to user profile
    navigate(`/profile/${id}`);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message to the server
    console.log('Sending message:', newMessage);
    
    // Clear the input
    setNewMessage('');
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header 
        title={directChat.name}
        centerTitle
        leftElement={
          <button onClick={handleBackClick} className="flex items-center text-cendy-text">
            <ArrowLeft size={20} />
          </button>
        }
        rightElement={
          <button onClick={handleInfoClick} className="text-cendy-text">
            <MoreHorizontal size={20} />
          </button>
        }
      />
      
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {directChat.messages.map((message) => (
            <ChatMessage 
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              isCurrentUser={message.isCurrentUser}
            />
          ))}
        </div>
      </main>
      
      <div className="bg-white p-3 border-t border-cendy-gray-medium">
        <div className="flex items-center gap-2">
          <button className="text-cendy-text-secondary">
            <Smile size={24} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-full border border-cendy-gray-medium px-4 py-2 focus:outline-none focus:border-cendy-blue"
          />
          <button 
            onClick={handleSendMessage}
            className="bg-cendy-blue rounded-full p-2 text-white"
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
