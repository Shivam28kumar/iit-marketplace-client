// src/components/chat/Conversation.js
import React from 'react';
import './Conversation.css'; // We will add styles for the new badge
import { useAuthContext } from '../../context/AuthContext';

const Conversation = ({ conversation, isSelected, onClick }) => {
  const { user: authUser } = useAuthContext();
  const otherParticipant = conversation.participants[0];

  // Determine what the last message preview should show
  let lastMessageText = "No messages yet...";
  if (conversation.lastMessage) {
    const fromMe = conversation.lastMessage.senderId === authUser.id;
    // Prepend "You: " if the logged-in user sent the last message
    lastMessageText = `${fromMe ? "You: " : ""}${conversation.lastMessage.message}`;
  }
  // Truncate the message if it's too long
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
        {/*
          We can add a class to the last message to make it bold if it's unread.
          This is a common UX pattern.
        */}
        <p className={`last-message ${conversation.unreadCount > 0 ? 'unread' : ''}`}>
          {lastMessageText}
        </p>
      </div>

      {/* --- THIS IS THE FIX --- */}
      {/* We conditionally render the unread count badge. */}
      {/* It will only appear if the count is greater than 0. */}
      {conversation.unreadCount > 0 && (
        <span className="unread-badge">{conversation.unreadCount}</span>
      )}
    </div>
  );
};

export default Conversation;