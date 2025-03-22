
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ChatItem from '@/components/chats/ChatItem';

// Mock data
const MOCK_CHATROOMS = [
  {
    id: 'chatroom-1',
    name: "Biology 101 Study Group",
    lastMessage: "Alex: I can help with that! I got full marks on that part of the lab.",
    timestamp: "3:01 PM",
    unreadCount: 2,
    isGroupChat: true
  },
  {
    id: 'chatroom-2',
    name: "Campus Housing Chat",
    lastMessage: "Jordan: Does anyone know when the housing applications open?",
    timestamp: "Yesterday",
    unreadCount: 0,
    isGroupChat: true
  }
];

const MOCK_DIRECT_CHATS = [
  {
    id: 'direct-1',
    name: "Jamie Wilson",
    lastMessage: "Saturday works for me. Let's meet at 2pm in the main library, second floor?",
    timestamp: "Yesterday",
    unreadCount: 0,
    isGroupChat: false
  },
  {
    id: 'direct-2',
    name: "Riley Evans",
    lastMessage: "Thanks for sharing your notes!",
    timestamp: "Monday",
    unreadCount: 0,
    isGroupChat: false
  }
];

const MOCK_REQUESTS = [
  {
    id: 'request-1',
    name: "Taylor Smith",
    lastMessage: "Hi! I saw your post about the CS study group. Can I join?",
    timestamp: "2d",
    unreadCount: 1,
    isGroupChat: false
  },
  {
    id: 'request-2',
    name: "Jordan Lee",
    lastMessage: "Hey, we're in the same accounting class. Wanted to connect!",
    timestamp: "4d",
    unreadCount: 1,
    isGroupChat: false
  },
  {
    id: 'request-3',
    name: "Alex Morgan",
    lastMessage: "Hi there! I'm organizing a campus event, thought you might be interested.",
    timestamp: "1w",
    unreadCount: 1,
    isGroupChat: false
  }
];

const MessagesHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [activeTab, setActiveTab] = useState<'chats' | 'requests'>('chats');
  
  const handleSearchClick = () => {
    navigate('/messages/search');
  };
  
  const handleCreateChat = () => {
    toast({
      title: "Create Chat",
      description: "This feature is coming soon!",
    });
  };
  
  const handleChatroomClick = (chatroomId: string) => {
    navigate(`/messages/chatroom/${chatroomId}`);
  };
  
  const handleDirectChatClick = (userId: string) => {
    navigate(`/messages/direct/${userId}`);
  };
  
  const handleRequestClick = (requestId: string) => {
    navigate(`/messages/direct/${requestId}`);
  };
  
  if (!isVerified) {
    return (
      <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
        <Header 
          title="Messages" 
          centerTitle
          rightElement={
            <button onClick={handleSearchClick} className="text-cendy-text">
              <Search size={20} />
            </button>
          }
        />
        
        <main className="flex-1 p-4">
          <div className="flex animate-fade-in flex-col items-center justify-center rounded-xl border border-cendy-gray-medium bg-white p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cendy-gray">
              <Search size={24} className="text-cendy-text-secondary" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-cendy-text">Verification Required</h3>
            <p className="mb-4 text-sm text-cendy-text-secondary">
              Only verified users can send and receive messages. Sign in with your college email to access this feature.
            </p>
          </div>
        </main>
        
        <BottomNavigation />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-cendy-gray pb-20">
      <Header 
        title="Messages" 
        centerTitle
        rightElement={
          <div className="flex items-center gap-2">
            <button onClick={handleCreateChat} className="text-cendy-text">
              <Plus size={20} />
            </button>
            <button onClick={handleSearchClick} className="text-cendy-text">
              <Search size={20} />
            </button>
          </div>
        }
      />
      
      <div className="bg-white px-4 py-3 flex border-b border-cendy-gray-medium">
        <div className="flex w-full">
          <button 
            className={`flex-1 text-center py-2 ${activeTab === 'chats' ? 'text-cendy-blue border-b-2 border-cendy-blue font-medium' : 'text-cendy-text-secondary'}`}
            onClick={() => setActiveTab('chats')}
          >
            All chats
          </button>
          <button 
            className={`flex-1 text-center py-2 relative ${activeTab === 'requests' ? 'text-cendy-blue border-b-2 border-cendy-blue font-medium' : 'text-cendy-text-secondary'}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests
            {MOCK_REQUESTS.length > 0 && (
              <span className="absolute top-0 right-12 bg-cendy-blue text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                {MOCK_REQUESTS.length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {activeTab === 'chats' ? (
        <div className="bg-white px-4 py-2 flex-1">
          {[...MOCK_DIRECT_CHATS, ...MOCK_CHATROOMS].length > 0 ? (
            <div>
              {MOCK_DIRECT_CHATS.map(chat => (
                <ChatItem 
                  key={chat.id}
                  name={chat.name}
                  lastMessage={chat.lastMessage}
                  timestamp={chat.timestamp}
                  unreadCount={chat.unreadCount}
                  isGroupChat={chat.isGroupChat}
                  onClick={() => handleDirectChatClick(chat.id)}
                />
              ))}
              
              {MOCK_CHATROOMS.map(chatroom => (
                <ChatItem 
                  key={chatroom.id}
                  name={chatroom.name}
                  lastMessage={chatroom.lastMessage}
                  timestamp={chatroom.timestamp}
                  unreadCount={chatroom.unreadCount}
                  isGroupChat={chatroom.isGroupChat}
                  onClick={() => handleChatroomClick(chatroom.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-cendy-text-secondary">No messages yet</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white px-4 py-2 flex-1">
          {MOCK_REQUESTS.length > 0 ? (
            <div>
              {MOCK_REQUESTS.map(request => (
                <ChatItem 
                  key={request.id}
                  name={request.name}
                  lastMessage={request.lastMessage}
                  timestamp={request.timestamp}
                  unreadCount={request.unreadCount}
                  isGroupChat={request.isGroupChat}
                  onClick={() => handleRequestClick(request.id)}
                />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-cendy-text-secondary">No requests yet</p>
            </div>
          )}
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default MessagesHome;
