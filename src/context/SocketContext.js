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
  const { setMessages, selectedConversation, setConversations } = useConversation();

  // This useEffect hook handles connecting and disconnecting the socket.
  useEffect(() => {
    if (user) {
      // --- THIS IS THE CRITICAL FIX ---
      // We define the backend URL based on the environment.
      // 'process.env.NODE_ENV' is 'development' on your local machine and 'production' on Vercel.
      // 'process.env.REACT_APP_API_URL' is the environment variable we set in Vercel.
      const SOCKET_URL = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_URL
        : 'http://localhost:5000';

      // We now connect to the correct URL.
      const newSocket = io(SOCKET_URL, {
        query: {
          userId: user.id,
        },
      });

      setSocket(newSocket);

      // Cleanup function to close the socket when the user logs out.
      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  // This useEffect handles all the real-time event listeners.
  useEffect(() => {
    if (socket) {
      const messageListener = ({ newMessage, conversationId }) => {
        const sound = new Audio(notificationSound);
        sound.play().catch(e => console.log("Audio play blocked by browser"));
        fetchUnreadCount();

        if (selectedConversation?._id === conversationId) {
          setMessages((prev) => [...prev, newMessage]);
        }
        
        // This logic updates the "last message" preview in the sidebar in real-time.
        setConversations(prevConvos => {
            const convoIndex = prevConvos.findIndex(c => c._id === conversationId);
            if (convoIndex !== -1) {
                const updatedConvo = { ...prevConvos[convoIndex], lastMessage: newMessage, updatedAt: newMessage.createdAt };
                const newConvos = [...prevConvos];
                newConvos.splice(convoIndex, 1); // Remove the old one
                newConvos.unshift(updatedConvo); // Add the updated one to the top
                return newConvos;
            }
            return prevConvos; // If conversation not in list, do nothing (it will appear on next fetch)
        });
      };

      const conversationsUpdatedListener = () => {
        // This is a placeholder for potential future features like read receipts.
      };

      socket.on("newMessage", messageListener);
      socket.on("conversationsUpdated", conversationsUpdatedListener);

      return () => {
        socket.off("newMessage", messageListener);
        socket.off("conversationsUpdated", conversationsUpdatedListener);
      };
    }
  }, [socket, fetchUnreadCount, selectedConversation, setMessages, setConversations]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};