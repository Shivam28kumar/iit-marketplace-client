// src/hooks/useListenMessages.js
import { useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useConversation } from '../context/ConversationContext';
import { useAuthContext } from '../context/AuthContext';
import notificationSound from '../assets/sounds/notification.mp3';

const useListenMessages = () => {
  const socket = useContext(SocketContext);
  
  // --- THIS IS THE FIX ---
  // We no longer need to get the 'messages' variable here. We only need the setter function.
  const { setMessages, selectedConversation } = useConversation();
  
  const { fetchUnreadCount } = useAuthContext();

  useEffect(() => {
    if (socket) {
      const messageListener = (newMessage) => {
        // Play sound and refresh the unread count in the navbar
        const sound = new Audio(notificationSound);
        sound.play();
        fetchUnreadCount();

        // Use the functional update form to avoid stale state.
        // This is a robust way to update the state based on its previous value.
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.on("newMessage", messageListener);

      // Cleanup function to remove the event listener when the component unmounts.
      return () => {
        socket.off("newMessage", messageListener);
      };
    }
  }, [socket, setMessages, selectedConversation, fetchUnreadCount]); // Dependencies for the effect
};

export default useListenMessages;