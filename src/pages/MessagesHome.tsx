
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ChatItem from '@/components/chats/ChatItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const MessagesHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [activeTab, setActiveTab] = useState("all");
  
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white px-4 py-2">
          <TabsList className="grid w-full grid-cols-3 bg-cendy-gray rounded-lg p-1 h-10">
            <TabsTrigger value="all" className="rounded-md text-sm">All</TabsTrigger>
            <TabsTrigger value="direct" className="rounded-md text-sm">Direct</TabsTrigger>
            <TabsTrigger value="groups" className="rounded-md text-sm">Groups</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <div className="bg-white px-4 py-2">
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
            
            {MOCK_DIRECT_CHATS.length === 0 && MOCK_CHATROOMS.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-cendy-text-secondary">No messages yet</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="direct" className="mt-0">
          <div className="bg-white px-4 py-2">
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
            
            {MOCK_DIRECT_CHATS.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-cendy-text-secondary">No direct messages yet</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="groups" className="mt-0">
          <div className="bg-white px-4 py-2">
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
            
            {MOCK_CHATROOMS.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-cendy-text-secondary">No group chats yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <BottomNavigation />
    </div>
  );
};

export default MessagesHome;
