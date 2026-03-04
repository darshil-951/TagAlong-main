import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, Chat, User } from '../types';
import { useAuth } from './AuthContext';
import { getSocketUrl, getApiEndpoint } from '../utils/api';

interface ChatContextType {
  messages: Record<string, Message[]>;
  chats: Chat[];
  activeChat: string | null;
  isLoading: boolean;
  sendMessage: (receiverId: string, content: string, type: Message['type'], metadata?: Message['metadata']) => Promise<boolean>;
  setActiveChat: (userId: string) => void;
  typingStatus: Record<string, boolean>;
  startTyping: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
  refreshChatHistory: (userId1: string, userId2: string) => Promise<void>;
  refreshChats: () => Promise<void>;
  sendImage: (receiverId: string, file: File) => Promise<boolean>;
  sendLocation: (receiverId: string, latitude: number, longitude: number) => Promise<boolean>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  
  // Connect to socket when user is authenticated
  useEffect(() => {
    if (!currentUser) return;
    
    const newSocket = io(getSocketUrl(), {
      query: { userId: currentUser._id }
    });
    
    setSocket(newSocket);
    
    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });
    
    newSocket.on('new_message', (message: Message) => {
      // Add message to state
      setMessages(prev => {
        const senderId = message.senderId;
        const prevMessages = prev[senderId] || [];
        return {
          ...prev,
          [senderId]: [...prevMessages, message]
        };
      });
      
      // Update chats list
      refreshChats();
    });
    newSocket.on('message', (message) => {
      // Your existing code for handling messages
      
      // If the message is not from the current user and the chat is not active, create a notification
      if (message.senderId !== currentUser._id && activeChat !== message.senderId) {
        // You could add a function to create a notification via API
        createMessageNotification(message);
      }
    });
    newSocket.on('typing_start', (data: { userId: string }) => {
      setTypingStatus(prev => ({ ...prev, [data.userId]: true }));
    });
    
    newSocket.on('typing_end', (data: { userId: string }) => {
      setTypingStatus(prev => ({ ...prev, [data.userId]: false }));
    });
    
    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);
  
  // Refresh chat history between two users
  const refreshChatHistory = async (userId1: string, userId2: string) => {
    if (!socket) return;
    
    setIsLoading(true);
    
    return new Promise<void>((resolve, reject) => {
      socket.emit('get_chat_history', { userId1, userId2 }, (response: any) => {
        if (response.success) {
          setMessages(prev => ({
            ...prev,
            [userId2]: response.messages
          }));
          setIsLoading(false);
          resolve();
        } else {
          console.error('Failed to fetch chat history:', response.error);
          setIsLoading(false);
          reject(new Error(response.error));
        }
      });
    });
  };
  
  // For the createMessageNotification function
  async function createMessageNotification(message: any) {
    try {
      if (!currentUser) return; // Add this null check
      
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      await fetch(getApiEndpoint('/api/notifications'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: currentUser._id,
          type: 'message',
          title: `New message from ${message.senderName || 'a user'}`,
          content: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : ''),
          actionUrl: `/messages?id=${message.senderId}`,
          metadata: { chatId: message.senderId }
        })
      });
    } catch (error) {
      console.error('Error creating message notification:', error);
    }
  };
  // Refresh all chats for current user
  const refreshChats = async () => {
    if (!socket || !currentUser) return Promise.resolve();
    
    return new Promise<void>((resolve, reject) => {
      // Add timeout to prevent hanging requests
      const timeoutId = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, 10000); // 10 seconds timeout
      
      socket.emit('get_user_chats', { userId: currentUser._id }, (response: any) => {
        clearTimeout(timeoutId); // Clear timeout on response
        
        if (response.success) {
          setChats(response.chats);
          resolve();
        } else {
          console.error('Failed to fetch chats:', response.error);
          reject(new Error(response.error));
        }
      });
    });
  };
  
  // Send a message
  const sendMessage = async (
    receiverId: string,
    content: string,
    type: Message['type'] = 'text',
    metadata?: Message['metadata']
  ): Promise<boolean> => {
    if (!socket || !currentUser) return false;
    
    return new Promise((resolve) => {
      const message = {
        senderId: currentUser._id,
        receiverId,
        content,
        type,
        metadata,
        timestamp: Date.now()
      };
      
      socket.emit('send_message', message, (response: any) => {
        if (response.success) {
          // Add message to state
          setMessages(prev => {
            const prevMessages = prev[receiverId] || [];
            return {
              ...prev,
              [receiverId]: [...prevMessages, response.message]
            };
          });
          
          // Update chats list
          refreshChats();
          resolve(true);
        } else {
          console.error('Failed to send message:', response.error);
          resolve(false);
        }
      });
    });
  };
  
  // Send an image
  const sendImage = async (receiverId: string, file: File): Promise<boolean> => {
    if (!currentUser) return false;
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', file);
    formData.append('senderId', currentUser._id);
    formData.append('receiverId', receiverId);
    
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const response = await fetch(getApiEndpoint('/api/chat/upload-image'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      // Send message with image URL
      return sendMessage(
        receiverId,
        'Image',
        'image',
        { imageUrl: data.imageUrl }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      return false;
    }
  };
  
  // Send location
  const sendLocation = async (
    receiverId: string,
    latitude: number,
    longitude: number
  ): Promise<boolean> => {
    return sendMessage(
      receiverId,
      'Location',
      'location',
      { latitude, longitude }
    );
  };
  
  // Typing indicators
  const startTyping = (receiverId: string) => {
    if (!socket || !currentUser) return;
    
    socket.emit('typing_start', {
      senderId: currentUser._id,
      receiverId
    });
  };
  
  const stopTyping = (receiverId: string) => {
    if (!socket || !currentUser) return;
    
    socket.emit('typing_end', {
      senderId: currentUser._id,
      receiverId
    });
  };
  
  // Load initial chats when user is authenticated
  useEffect(() => {
    if (currentUser) {
      refreshChats();
    }
  }, [currentUser]);
  
  return (
    <ChatContext.Provider
      value={{
        messages,
        chats,
        activeChat,
        isLoading,
        sendMessage,
        setActiveChat,
        typingStatus,
        startTyping,
        stopTyping,
        refreshChatHistory,
        refreshChats,
        sendImage,
        sendLocation
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};



