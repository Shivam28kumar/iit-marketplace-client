// src/context/SocketContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useAuthContext } from './AuthContext';
import { useConversation } from './ConversationContext';
import notificationSound from '../assets/sounds/notification.mp3';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, fetchUnreadCount } = useAuthContext();
  const { setMessages, selectedConversation, conversations, setConversations } = useConversation();

  // Effect to connect/disconnect the socket
  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000', { query: { userId: user.id } });
      setSocket(newSocket);
      return () => newSocket.close();
    } else {
      if (socket) { socket.close(); setSocket(null); }
    }
  }, [user]);

  // Global Listener Effect for real-time events
  useEffect(() => {
    if (socket) {
      // --- Listens for NEW MESSAGES ---
      const messageListener = ({ newMessage, conversationId }) => {
        const sound = new Audio(notificationSound);
        sound.play().catch(e => console.log("Audio play blocked"));
        fetchUnreadCount(); // Update the main badge

        // If the user is looking at the correct conversation, add the message to the view
        if (selectedConversation?._id === conversationId) {
          setMessages((prev) => [...prev, newMessage]);
        }
        
        // Also, we should update the "last message" in the sidebar in real-time
        setConversations(prevConvos => {
            const updatedConvos = prevConvos.map(convo => {
                if(convo._id === conversationId) {
                    return { ...convo, lastMessage: newMessage };
                }
                return convo;
            });
            // Bring the updated conversation to the top
            return updatedConvos.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });
      };

      // --- Listens for when ANOTHER user reads OUR messages ---
      const conversationsUpdatedListener = () => {
        // A simple way to update the sidebar with new read statuses is to just refetch the list
        // This is a placeholder for a more advanced implementation
        console.log("Conversations updated event received.");
      };

      socket.on("newMessage", messageListener);
      socket.on("conversationsUpdated", conversationsUpdatedListener);

      return () => {
        socket.off("newMessage", messageListener);
        socket.off("conversationsUpdated", conversationsUpdatedListener);
      };
    }
  }, [socket, user, fetchUnreadCount, selectedConversation, setMessages, setConversations]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};