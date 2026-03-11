import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { Chat, Message as MessageType } from '../types';
import { Send, Image, MapPin, ArrowLeft, Search, MessageSquare, UserCheck } from 'lucide-react';
import gsap from 'gsap';
import { getAvatarSrc } from '../utils/avatar';

const ChatPage: React.FC = () => {
  const {
    messages,
    chats,
    activeChat,
    setActiveChat,
    sendMessage,
    typingStatus,
    startTyping,
    stopTyping,
    refreshChats,
    refreshChatHistory,
    sendImage,
    sendLocation
  } = useChat();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messageInput, setMessageInput] = useState('');
  const [showChatList, setShowChatList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Animation refs
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount

    // Apply entrance animation
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  // Fetch chats on mount with improved logic
  useEffect(() => {
    if (currentUser) {
      // Try to refresh chats with retry mechanism
      const loadChats = async (retryCount = 0) => {
        try {
          await refreshChats();

          // Check if there's a chat ID in the URL params
          const chatId = searchParams.get('id');
          if (chatId) {
            handleChatSelect(chatId);
          } else {
            // Check if there's a selected chat in localStorage
            const storedChat = localStorage.getItem('tagalong-selected-chat');
            if (storedChat) {
              try {
                const chatData = JSON.parse(storedChat);
                if (chatData.partnerId) {
                  // Instead of just using the stored data, fetch fresh data from MongoDB
                  handleChatSelect(chatData.partnerId);
                }
              } catch (error) {
                console.error('Failed to parse stored chat data:', error);
              }
            }
          }
        } catch (error) {
          console.error(`Failed to load chats (attempt ${retryCount + 1}/3):`, error);
          // Retry up to 3 times with increasing delay
          if (retryCount < 2) {
            setTimeout(() => loadChats(retryCount + 1), 1000 * (retryCount + 1));
          }
        }
      };

      loadChats();
    }
  }, [currentUser]);

  // // Scroll to bottom when messages change
  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [messages, activeChat]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat || !currentUser) return;

    sendMessage(activeChat, messageInput, 'text');
    setMessageInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);

    if (activeChat) {
      startTyping(activeChat);

      // Debounce typing indicator
      const timeoutId = setTimeout(() => {
        stopTyping(activeChat);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;

    setIsUploading(true);
    try {
      await sendImage(activeChat, file);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleShareLocation = () => {
    if (!activeChat) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sendLocation(activeChat, latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Failed to get your location. Please check your browser permissions.');
      }
    );
  };

  const handleChatSelect = (chatId: string) => {
    if (!currentUser) return;

    setActiveChat(chatId);
    refreshChatHistory(currentUser._id, chatId);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
  };

  // Filter out duplicate chats based on user ID
  const uniqueChats = chats.reduce((acc: Chat[], chat) => {
    // Check if we already have a chat with this user
    const existingChat = acc.find(c => c.user?._id === chat.user?._id);
    if (!existingChat) {
      acc.push(chat);
    } else if (chat.lastMessage && (!existingChat.lastMessage ||
      new Date(chat.lastMessage.timestamp) > new Date(existingChat.lastMessage.timestamp))) {
      // If this chat has a newer message, replace the existing one
      const index = acc.findIndex(c => c.user?._id === chat.user?._id);
      acc[index] = chat;
    }
    return acc;
  }, []);

  const filteredChats = uniqueChats.filter(chat => {
    if (!searchQuery) return true;

    // Use chat.user directly since it's now defined in the Chat interface
    const otherParticipant = chat.user;

    // Search by name or last message content
    return (
      otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatTime = (timestamp: string | number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string | number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderMessageContent = (message: MessageType) => {
    switch (message.type) {
      case 'text':
        return <p className="whitespace-pre-wrap">{message.content}</p>;
      case 'image':
        return (
          <div className="relative">
            <img
              src={message.metadata?.imageUrl}
              alt="Shared image"
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.metadata?.imageUrl, '_blank')}
            />
          </div>
        );
      case 'location':
        return (
          <div className="flex flex-col">
            <p className="mb-1">📍 Shared location</p>
            <a
              href={`https://maps.google.com/?q=${message.metadata?.latitude},${message.metadata?.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on map
            </a>
          </div>
        );
      default:
        return <p>{message.content}</p>;
    }
  };

  // Group messages by date
  const groupedMessages = activeChat && messages[activeChat] ?
    messages[activeChat].reduce((groups: Record<string, MessageType[]>, message: MessageType) => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {}) : {};

  return (
    <div ref={pageRef} className="container mx-auto px-5 py-20 max-w-6xl pt-15 "> {/* Increased top padding */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="flex h-[83vh]">
          {/* Chat List - Show on mobile only when showChatList is true */}
          <div
            className={`${showChatList ? 'block' : 'hidden'} md:block w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 ">
              <h2 className="text-xl font-semibold flex items-center pt-50 text-gray-900 dark:text-white">
                <MessageSquare className="mr-2" size={20} />
                Messages
              </h2>
              <div className="mt-3 relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(80vh-80px)]">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => {
                  // Modified to use chat.user instead of chat.participants
                  const otherParticipantId = chat.user?._id;

                  return (
                    <div
                      key={chat.user?._id}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${activeChat === otherParticipantId ? 'bg-teal-50 dark:bg-teal-900/30' : ''}`}
                      onClick={() => handleChatSelect(otherParticipantId || '')}
                    >
                      <div className="flex items-start">
                        <div className="relative">
                          <img
                            src={getAvatarSrc(chat.user?.avatar, chat.user?.name)}
                            alt={chat.user?.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${chat.user?.onlineStatus === 'online' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} border-2 border-white dark:border-gray-800`}></span>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{chat.user?.name}</h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {chat.lastMessage?.timestamp ? formatTime(chat.lastMessage.timestamp) : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                            {chat.lastMessage?.content}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="inline-block bg-teal-500 text-white text-xs rounded-full px-2 py-0.5 mt-1">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No conversations match your search' : 'No conversations yet'}
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div
            className={`${!showChatList ? 'block' : 'hidden'} md:block w-full md:w-2/3 flex flex-col`}
          >
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <button
                    className="md:hidden mr-2 text-gray-600 dark:text-gray-300"
                    onClick={handleBackToList}
                  >
                    <ArrowLeft size={20} />
                  </button>

                  {/* Find the active chat */}
                  {(() => {
                    // Modified to use chat.user instead of chat.participants
                    const activeUserChat = chats.find(chat => chat.user?._id === activeChat);
                    if (!activeUserChat) return null;

                    return (
                      <>
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src={getAvatarSrc(activeUserChat.user?.avatar, activeUserChat.user?.name)}
                              alt={activeUserChat.user?.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${activeUserChat.user?.onlineStatus === 'online' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} border-2 border-white dark:border-gray-800`}></span>
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{activeUserChat.user?.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {typingStatus[activeChat] ? (
                                <span className="text-teal-500">Typing...</span>
                              ) : (
                                activeUserChat.user?.onlineStatus === 'online' ? 'Online' : 'Offline'
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="ml-auto flex space-x-2">
                          {activeUserChat.user && (
                            <button 
                              onClick={() => navigate(`/profile/${activeUserChat.user._id}`)}
                              className="text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors flex items-center text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                              title="View Profile"
                            >
                              <UserCheck size={16} className="mr-1" /> Profile
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Chat Messages */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                  style={{ height: 'calc(80vh - 140px)' }}
                >
                  {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date}>
                      <div className="text-center my-4">
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                          {date}
                        </span>
                      </div>

                      {dateMessages.map((message, index) => {
                        const isCurrentUser = message.senderId === currentUser?._id;
                        const showAvatar = index === 0 || dateMessages[index - 1]?.senderId !== message.senderId;

                        return (
                          <div
                            key={message.id || index}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
                          >
                            {!isCurrentUser && showAvatar && (
                              <div className="flex-shrink-0 mr-2">
                                {/* Find the sender in chats */}
                                {(() => {
                                  // Modified to use chat.user instead of chat.participants
                                  const senderChat = chats.find(chat => chat.user?._id === message.senderId);
                                  return (
                                    <img
                                      src={getAvatarSrc(senderChat?.user?.avatar, senderChat?.user?.name)}
                                      alt={senderChat?.user?.name || 'User'}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  );
                                })()}
                              </div>
                            )}

                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isCurrentUser ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'}`}
                            >
                              {renderMessageContent(message)}
                              <div className={`text-xs mt-1 ${isCurrentUser ? 'text-teal-100' : 'text-gray-500'}`}>
                                {formatTime(message.timestamp)}
                                {isCurrentUser && (
                                  <span className="ml-2">
                                    {message.status === 'sent' ? '✓' : message.status === 'delivered' ? '✓✓' : message.status === 'read' ? '✓✓' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-end">
                    <div className="flex-1 relative">
                      <textarea
                        placeholder="Type a message..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        rows={1}
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <div className="flex ml-2 space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <button
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Image size={20} />
                      </button>
                      <button
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        onClick={handleShareLocation}
                      >
                        <MapPin size={20} />
                      </button>
                      <button
                        className="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <MessageSquare size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;