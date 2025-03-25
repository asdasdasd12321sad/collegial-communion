import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Check, User, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ChatItem from '@/components/chats/ChatItem';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const MessagesHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = user?.verificationStatus === 'verified';
  const [activeTab, setActiveTab] = useState<'chats' | 'requests'>('chats');
  const [chatrooms, setChatrooms] = useState<any[]>([]);
  const [directChats, setDirectChats] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newChatroomName, setNewChatroomName] = useState('');
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [createChatType, setCreateChatType] = useState<'direct' | 'group'>('direct');

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      setIsLoading(true);
      try {
        // Fetch chatrooms the user is a member of
        const { data: chatroomMemberships, error: membershipError } = await supabase
          .from('chatroom_members')
          .select('chatroom_id')
          .eq('user_id', user.id);

        if (membershipError) throw membershipError;

        if (chatroomMemberships && chatroomMemberships.length > 0) {
          const chatroomIds = chatroomMemberships.map(m => m.chatroom_id);
          
          const { data: chatroomsData, error: chatroomsError } = await supabase
            .from('chatrooms')
            .select(`
              id,
              name,
              owner_id,
              created_at,
              updated_at,
              owner:profiles!owner_id(display_name),
              messages(id, content, sender_id, created_at, is_read, sender:profiles!sender_id(display_name))
            `)
            .in('id', chatroomIds)
            .order('updated_at', { ascending: false });

          if (chatroomsError) throw chatroomsError;

          // Process chatroom data
          const processedChatrooms = chatroomsData?.map(chatroom => {
            const messages = chatroom.messages || [];
            const lastMessage = messages.length > 0 
              ? messages.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
              : null;
              
            // Count unread messages
            const unreadCount = messages.filter((m: any) => !m.is_read && m.sender_id !== user.id).length;
            
            // Fix the access to owner's display_name
            const ownerDisplayName = chatroom.owner?.display_name || 'Unknown';
            
            return {
              id: chatroom.id,
              name: chatroom.name,
              lastMessage: lastMessage 
                ? `${lastMessage.sender?.display_name || 'Unknown'}: ${lastMessage.content}` 
                : 'No messages yet',
              timestamp: lastMessage ? new Date(lastMessage.created_at).toISOString() : chatroom.created_at,
              unreadCount: unreadCount,
              isGroupChat: true
            };
          }) || [];
          
          setChatrooms(processedChatrooms);
        }

        // Fetch direct chats
        const { data: directChatsData, error: directChatsError } = await supabase
          .from('direct_chats')
          .select(`
            id,
            user1_id,
            user2_id,
            created_at,
            updated_at,
            user1:profiles!user1_id(id, display_name),
            user2:profiles!user2_id(id, display_name),
            messages(id, content, sender_id, created_at, is_read)
          `)
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

        if (directChatsError) throw directChatsError;

        // Process direct chat data
        const processedDirectChats = directChatsData?.map(chat => {
          // Determine the other user (fix access to properties)
          const otherUser = chat.user1_id === user.id ? chat.user2 : chat.user1;
          const otherUserId = otherUser?.id || 'unknown';
          const otherUserName = otherUser?.display_name || 'Unknown User';
          
          const messages = chat.messages || [];
          const lastMessage = messages.length > 0 
            ? messages.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
            : null;
            
          // Count unread messages
          const unreadCount = messages.filter((m: any) => !m.is_read && m.sender_id !== user.id).length;
          
          return {
            id: chat.id,
            otherUserId: otherUserId,
            name: otherUserName,
            lastMessage: lastMessage ? lastMessage.content : 'No messages yet',
            timestamp: lastMessage ? new Date(lastMessage.created_at).toISOString() : chat.created_at,
            unreadCount: unreadCount,
            isGroupChat: false
          };
        }) || [];
        
        setDirectChats(processedDirectChats);

        // Fetch chat requests
        const { data: requestsData, error: requestsError } = await supabase
          .from('chat_requests')
          .select(`
            id,
            sender_id,
            created_at,
            status,
            sender:profiles!sender_id(display_name)
          `)
          .eq('receiver_id', user.id)
          .eq('status', 'pending');

        if (requestsError) throw requestsError;

        // Process request data
        const processedRequests = requestsData?.map(request => {
          // Fix access to sender's display_name
          const senderName = request.sender?.display_name || 'Unknown User';
          
          return {
            id: request.id,
            senderId: request.sender_id,
            name: senderName,
            lastMessage: 'Would like to connect with you',
            timestamp: request.created_at,
            unreadCount: 1, // Always show as unread
            isGroupChat: false
          };
        }) || [];
        
        setRequests(processedRequests);
      } catch (error) {
        console.error('Error fetching chats:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();

    const messagesChannel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, () => {
        // Refresh chats when messages change
        fetchChats();
      })
      .subscribe();

    const requestsChannel = supabase
      .channel('requests-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_requests'
      }, () => {
        // Refresh requests when they change
        fetchChats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(requestsChannel);
    };
  }, [user]);

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };
  
  const handleCreateChatClick = () => {
    setIsCreateChatModalOpen(true);
  };
  
  const handleChatroomClick = (chatroomId: string) => {
    navigate(`/messages/chatroom/${chatroomId}`);
  };
  
  const handleDirectChatClick = (chatId: string, otherUserId?: string) => {
    // For existing direct chats
    if (chatId.startsWith('direct-')) {
      navigate(`/messages/direct/${otherUserId}`);
    } else {
      // For chatrooms or other types
      navigate(`/messages/direct/${chatId}`);
    }
  };
  
  const handleRequestClick = async (requestId: string, senderId: string) => {
    try {
      // Accept the request
      await supabase
        .from('chat_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);
      
      // Create a direct chat
      const { data: chatData, error: chatError } = await supabase
        .from('direct_chats')
        .insert({
          user1_id: user?.id,
          user2_id: senderId
        })
        .select();
      
      if (chatError) throw chatError;
      
      if (chatData && chatData.length > 0) {
        // Remove the request from the list
        setRequests(prev => prev.filter(r => r.id !== requestId));
        
        // Navigate to the new chat
        navigate(`/messages/direct/${chatData[0].id}`);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Search for users
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, display_name, university')
        .ilike('display_name', `%${searchQuery}%`)
        .neq('id', user?.id); // Exclude current user
      
      if (userError) throw userError;
      
      // Search for chatrooms
      const { data: chatroomData, error: chatroomError } = await supabase
        .from('chatrooms')
        .select('id, name')
        .ilike('name', `%${searchQuery}%`);
      
      if (chatroomError) throw chatroomError;
      
      // Combine results
      const combinedResults = [
        ...(userData || []).map(u => ({
          id: u.id,
          name: u.display_name,
          type: 'user',
          subtitle: u.university || 'University not specified'
        })),
        ...(chatroomData || []).map(c => ({
          id: c.id,
          name: c.name,
          type: 'chatroom',
          subtitle: 'Group Chat'
        }))
      ];
      
      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: 'Error',
        description: 'Failed to search. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = async (result: any) => {
    if (result.type === 'user') {
      // Check if there's already a direct chat with this user
      const existingChat = directChats.find(chat => 
        chat.otherUserId === result.id
      );
      
      if (existingChat) {
        navigate(`/messages/direct/${existingChat.id}`);
      } else {
        // Create a new chat request or direct chat
        try {
          // Check if there's a pending request already
          const { data: existingRequests } = await supabase
            .from('chat_requests')
            .select('*')
            .eq('sender_id', user?.id)
            .eq('receiver_id', result.id)
            .eq('status', 'pending');
          
          if (existingRequests && existingRequests.length > 0) {
            toast({
              title: 'Request Pending',
              description: 'You already have a pending request to this user.',
            });
            return;
          }
          
          // Create a new chat request
          await supabase
            .from('chat_requests')
            .insert({
              sender_id: user?.id,
              receiver_id: result.id
            });
          
          toast({
            title: 'Request Sent',
            description: 'A chat request has been sent to the user.',
          });
        } catch (error) {
          console.error('Error creating chat request:', error);
          toast({
            title: 'Error',
            description: 'Failed to create chat request. Please try again.',
            variant: 'destructive',
          });
        }
      }
    } else if (result.type === 'chatroom') {
      // Join or open chatroom
      navigate(`/messages/chatroom/${result.id}`);
    }
    
    setIsSearchModalOpen(false);
  };

  const handleCreateChat = async () => {
    if (createChatType === 'group' && (!newChatroomName.trim() || selectedUsers.length === 0)) {
      toast({
        title: 'Error',
        description: 'Please enter a chatroom name and select at least one user.',
        variant: 'destructive',
      });
      return;
    }
    
    if (createChatType === 'direct' && selectedUsers.length !== 1) {
      toast({
        title: 'Error',
        description: 'Please select exactly one user for a direct chat.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (createChatType === 'group') {
        // Create a new chatroom
        const { data: chatroomData, error: chatroomError } = await supabase
          .from('chatrooms')
          .insert({
            name: newChatroomName,
            owner_id: user?.id,
            is_private: false
          })
          .select();
        
        if (chatroomError) throw chatroomError;
        
        if (chatroomData && chatroomData.length > 0) {
          const chatroomId = chatroomData[0].id;
          
          // Add owner as member
          await supabase
            .from('chatroom_members')
            .insert({
              chatroom_id: chatroomId,
              user_id: user?.id
            });
          
          // Add selected users as members
          const memberPromises = selectedUsers.map(selectedUser => 
            supabase
              .from('chatroom_members')
              .insert({
                chatroom_id: chatroomId,
                user_id: selectedUser.id
              })
          );
          
          await Promise.all(memberPromises);
          
          toast({
            title: 'Chatroom Created',
            description: 'Your new chatroom has been created.',
          });
          
          // Navigate to the new chatroom
          navigate(`/messages/chatroom/${chatroomId}`);
        }
      } else {
        // Direct chat
        const selectedUser = selectedUsers[0];
        
        // Check for existing direct chat
        const { data: existingChats, error: existingChatsError } = await supabase
          .from('direct_chats')
          .select('id')
          .or(`and(user1_id.eq.${user?.id},user2_id.eq.${selectedUser.id}),and(user1_id.eq.${selectedUser.id},user2_id.eq.${user?.id})`);
        
        if (existingChatsError) throw existingChatsError;
        
        if (existingChats && existingChats.length > 0) {
          // Use existing chat
          navigate(`/messages/direct/${existingChats[0].id}`);
        } else {
          // Create new direct chat
          const { data: chatData, error: chatError } = await supabase
            .from('direct_chats')
            .insert({
              user1_id: user?.id,
              user2_id: selectedUser.id
            })
            .select();
          
          if (chatError) throw chatError;
          
          if (chatData && chatData.length > 0) {
            navigate(`/messages/direct/${chatData[0].id}`);
          }
        }
      }
      
      // Reset and close modal
      setNewChatroomName('');
      setSelectedUsers([]);
      setIsCreateChatModalOpen(false);
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to create chat. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUserSelect = (user: any) => {
    const isAlreadySelected = selectedUsers.some(selectedUser => selectedUser.id === user.id);
    
    if (isAlreadySelected) {
      setSelectedUsers(prev => prev.filter(selectedUser => selectedUser.id !== user.id));
    } else {
      if (createChatType === 'direct' && selectedUsers.length > 0) {
        // Replace the selected user for direct chats
        setSelectedUsers([user]);
      } else {
        setSelectedUsers(prev => [...prev, user]);
      }
    }
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week - show day name
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      // Older - show date
      return date.toLocaleDateString();
    }
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
            <button onClick={handleCreateChatClick} className="text-cendy-text">
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
            {requests.length > 0 && (
              <span className="absolute top-0 right-12 bg-cendy-blue text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                {requests.length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-cendy-blue border-t-transparent rounded-full"></div>
        </div>
      ) : (
        activeTab === 'chats' ? (
          <div className="bg-white px-4 py-2 flex-1">
            {[...directChats, ...chatrooms].length > 0 ? (
              <div>
                {directChats.map(chat => (
                  <ChatItem 
                    key={`direct-${chat.id}`}
                    name={chat.name}
                    lastMessage={chat.lastMessage}
                    timestamp={formatTimestamp(chat.timestamp)}
                    unreadCount={chat.unreadCount}
                    isGroupChat={chat.isGroupChat}
                    onClick={() => handleDirectChatClick(chat.id, chat.otherUserId)}
                  />
                ))}
                
                {chatrooms.map(chatroom => (
                  <ChatItem 
                    key={`chatroom-${chatroom.id}`}
                    name={chatroom.name}
                    lastMessage={chatroom.lastMessage}
                    timestamp={formatTimestamp(chatroom.timestamp)}
                    unreadCount={chatroom.unreadCount}
                    isGroupChat={chatroom.isGroupChat}
                    onClick={() => handleChatroomClick(chatroom.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-cendy-text-secondary">No messages yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleCreateChatClick}
                >
                  Start a new conversation
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white px-4 py-2 flex-1">
            {requests.length > 0 ? (
              <div>
                {requests.map(request => (
                  <ChatItem 
                    key={`request-${request.id}`}
                    name={request.name}
                    lastMessage={request.lastMessage}
                    timestamp={formatTimestamp(request.timestamp)}
                    unreadCount={request.unreadCount}
                    isGroupChat={request.isGroupChat}
                    onClick={() => handleRequestClick(request.id, request.senderId)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-cendy-text-secondary">No requests yet</p>
              </div>
            )}
          </div>
        )
      )}
      
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Chats</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Input
                placeholder="Search users or chatrooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            <ScrollArea className="h-[300px]">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map(result => (
                    <div 
                      key={`${result.type}-${result.id}`}
                      className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cendy-blue">
                        {result.type === 'user' ? (
                          <User size={20} />
                        ) : (
                          <UsersRound size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-xs text-cendy-text-secondary">{result.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                searchQuery && !isSearching && (
                  <div className="text-center py-4">
                    <p className="text-cendy-text-secondary">No results found</p>
                  </div>
                )
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCreateChatModalOpen} onOpenChange={setIsCreateChatModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Chat</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="direct" onValueChange={(value) => setCreateChatType(value as 'direct' | 'group')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="direct">Direct Chat</TabsTrigger>
              <TabsTrigger value="group">Group Chat</TabsTrigger>
            </TabsList>
            
            <TabsContent value="direct" className="py-4">
              <p className="text-sm text-cendy-text-secondary mb-4">
                Start a private conversation with another user.
              </p>
              <div className="space-y-4">
                <div>
                  <Label>Select a User</Label>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {selectedUsers.map(user => (
                      <Button
                        key={user.id}
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => handleUserSelect(user)}
                      >
                        {user.name}
                        <X size={16} />
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Input
                    placeholder="Search for users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
                
                <ScrollArea className="h-[200px] border rounded-md p-2">
                  {searchResults
                    .filter(result => result.type === 'user')
                    .map(user => (
                      <div 
                        key={user.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cendy-blue/80 text-sm font-medium text-white mr-2">
                            <User size={16} />
                          </div>
                          <span>{user.name}</span>
                        </div>
                        {selectedUsers.some(selectedUser => selectedUser.id === user.id) && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    ))}
                  
                  {searchQuery && !isSearching && searchResults.filter(result => result.type === 'user').length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-cendy-text-secondary">No users found</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="group" className="py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="chatroom-name">Chatroom Name</Label>
                  <Input
                    id="chatroom-name"
                    placeholder="Enter a name for the chatroom"
                    value={newChatroomName}
                    onChange={(e) => setNewChatroomName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Select Members</Label>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {selectedUsers.map(user => (
                      <Button
                        key={user.id}
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => handleUserSelect(user)}
                      >
                        {user.name}
                        <X size={16} />
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Input
                    placeholder="Search for users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
                
                <ScrollArea className="h-[200px] border rounded-md p-2">
                  {searchResults
                    .filter(result => result.type === 'user')
                    .map(user => (
                      <div 
                        key={user.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cendy-blue/80 text-sm font-medium text-white mr-2">
                            <User size={16} />
                          </div>
                          <span>{user.name}</span>
                        </div>
                        {selectedUsers.some(selectedUser => selectedUser.id === user.id) && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    ))}
                  
                  {searchQuery && !isSearching && searchResults.filter(result => result.type === 'user').length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-cendy-text-secondary">No users found</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button
              onClick={handleCreateChat}
              className="w-full"
            >
              Create Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default MessagesHome;
