// src/hooks/useListenMessages.js
import { useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useConversation } from '../context/ConversationContext';
import { useAuthContext } from '../context/AuthContext';
import notificationSound from '../assets/sounds/notification.mp3';

const useListenMessages = () => {
  const socket = useContext(SocketContext);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { fetchUnreadCount } = useAuthContext();

  useEffect(() => {
    if (socket) {
      const messageListener = (newMessage) => {
        try {
          const sound = new Audio(notificationSound);
          sound.play().catch(e => console.log("Audio play blocked by browser"));
        } catch (e) {
            console.log("Could not play sound", e);
        }
        
        fetchUnreadCount(); // Always update the badge count

        // --- THIS IS THE CRITICAL FIX for REAL-TIME ---
        // We use the functional update form. This always works.
        // It tells React to get the most recent 'messages' array and add the new one.
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.on("newMessage", messageListener);

      return () => {
        socket.off("newMessage", messageListener);
      };
    }
    // We only want to set up and tear down this listener when the socket connection changes.
  }, [socket, setMessages, fetchUnreadCount]);

  // We also want to filter which messages are displayed inside the MessageContainer,
  // but the listener itself should always add messages to the main array.
};

export default useListenMessages; 