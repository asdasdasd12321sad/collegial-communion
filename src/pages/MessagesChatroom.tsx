
import React, { useState } from 'react';
import { ArrowLeft, MoreHorizontal, Users, Send, Smile } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import ChatMessage from '@/components/chats/ChatMessage';
import BottomNavigation from '@/components/layout/BottomNavigation';

// Mock data for a chatroom
const MOCK_CHATROOM = {
  id: 'chatroom-1',
  name: "Biology 101 Study Group",
  members: [
    { id: 'user-1', name: 'Alex Thompson' },
    { id: 'user-2', name: 'Jamie Wilson' },
    { id: 'user-3', name: 'Riley Evans' },
    { id: 'current-user', name: 'You' }
  ],
  messages: [
    { id: 'msg-1', content: "Hey everyone! What topics are we focusing on for next week's study session?", senderId: 'user-1', senderName: 'Alex Thompson', timestamp: '2:30 PM', isCurrentUser: false },
    { id: 'msg-2', content: "I think we should cover chapter 5 on cellular respiration. That's going to be a big part of the midterm.", senderId: 'user-2', senderName: 'Jamie Wilson', timestamp: '2:32 PM', isCurrentUser: false },
    { id: 'msg-3', content: "That sounds good to me. I'm still struggling with the electron transport chain concept.", senderId: 'user-3', senderName: 'Riley Evans', timestamp: '2:35 PM', isCurrentUser: false },
    { id: 'msg-4', content: "I can help explain that! Let's meet at the library around 4pm on Tuesday?", senderId: 'current-user', senderName: 'You', timestamp: '2:37 PM', isCurrentUser: true },
    { id: 'msg-5', content: "Perfect, Tuesday at 4 works for me!", senderId: 'user-1', senderName: 'Alex Thompson', timestamp: '2:38 PM', isCurrentUser: false },
    { id: 'msg-6', content: "I'll be there!", senderId: 'user-2', senderName: 'Jamie Wilson', timestamp: '2:40 PM', isCurrentUser: false }
  ]
};

const MessagesChatroom: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isUserMember, setIsUserMember] = useState(true);
  
  // Get chatroom data (would come from API in a real app)
  const chatroom = MOCK_CHATROOM;
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleInfoClick = () => {
    // Navigate to chatroom info page
    navigate(`/messages/chatroom/${id}/info`);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message to the server
    console.log('Sending message:', newMessage);
    
    // Clear the input
    setNewMessage('');
  };
  
  const handleJoinChatroom = () => {
    // In a real app, this would add the user to the chatroom
    setIsUserMember(true);
    console.log('User joined the chatroom');
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header 
        title={chatroom.name}
        centerTitle 
        leftElement={
          <button onClick={handleBackClick} className="flex items-center text-cendy-text">
            <ArrowLeft size={20} />
          </button>
        }
        rightElement={
          <button onClick={handleInfoClick} className="text-cendy-text">
            <Users size={20} />
          </button>
        }
      />
      
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {chatroom.messages.map((message) => (
            <ChatMessage 
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              isCurrentUser={message.isCurrentUser}
              senderName={message.senderName}
              isGroupChat={true}
            />
          ))}
        </div>
      </main>
      
      {isUserMember ? (
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
      ) : (
        <div className="bg-white p-4 border-t border-cendy-gray-medium">
          <button 
            onClick={handleJoinChatroom}
            className="w-full bg-cendy-blue text-white rounded-full py-2 font-medium"
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
