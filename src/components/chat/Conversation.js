// src/components/chat/Conversation.js
import React from 'react';
import './Conversation.css';
import { useAuthContext } from '../../context/AuthContext'; // We need this to check who sent the last message

const Conversation = ({ conversation, isSelected, onClick }) => {
  const { user: authUser } = useAuthContext();
  const otherParticipant = conversation.participants[0];

  // --- NEW LOGIC for Last Message ---
  let lastMessageText = "No messages yet...";
  if (conversation.lastMessage) {
    // Check if the logged-in user was the sender of the last message
    const fromMe = conversation.lastMessage.senderId === authUser.id;
    // Prepend "You: " if you sent the last message
    lastMessageText = `${fromMe ? "You: " : ""}${conversation.lastMessage.message}`;
  }

  // Truncate the message if it's too long to fit in the sidebar
  if (lastMessageText.length > 25) {
    lastMessageText = lastMessageText.substring(0, 25) + "...";
  }

  return (
    <div
      className={`conversation ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <img src={conversation.product?.imageUrl} alt="product" className="conversation-image" />
      <div className="conversation-info">
        <p className="conversation-name">{otherParticipant?.fullName || 'Chat'}</p>
        {/* --- THIS IS THE FIX --- */}
        {/* We now display the formatted last message text */}
        <p className="last-message">{lastMessageText}</p>
      </div>
    </div>
  );
};

export default Conversation;