// src/hooks/useListenMessages.js
import { useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useConversation } from '../context/ConversationContext';
import notificationSound from '../assets/sounds/notification.mp3'; // We'll add this sound file

const useListenMessages = () => {
  const socket = useContext(SocketContext); // Get the connected socket
  const { messages, setMessages } = useConversation(); // Get the global messages state

  useEffect(() => {
    // Make sure we have a socket connection before listening
    if (socket) {
      // Start listening for the 'newMessage' event from the server
      socket.on("newMessage", (newMessage) => {
        // Play a notification sound
        const sound = new Audio(notificationSound);
        sound.play();
        
        // Add the new message to our global message state
        // This will cause any component using this state to re-render
        setMessages([...messages, newMessage]);
      });

      // --- IMPORTANT: Clean up the event listener ---
      // This is a best practice to prevent memory leaks and duplicate listeners.
      // When the component unmounts, we stop listening.
      return () => socket.off("newMessage");
    }
  }, [socket, setMessages, messages]); // The hook re-runs if any of these dependencies change
};

export default useListenMessages;