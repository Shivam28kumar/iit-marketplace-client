// src/components/chat/Message.js
import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import './Message.css';
import { format } from 'date-fns'; // Import the date formatting function

const Message = ({ message }) => {
  const { user: authUser } = useAuthContext();
  const fromMe = message.senderId?.toString() === authUser?.id?.toString();
  const chatClassName = fromMe ? 'sent' : 'received';

  // Format the timestamp. Example: "11:45 PM"
  const formattedTime = format(new Date(message.createdAt), 'p');

  return (
    // The container that aligns the message bubble left or right
    <div className={`message ${chatClassName}`}>
      <div className="message-content">
        <p style={{ margin: 0 }}>{message.message}</p>
        {/* The small timestamp below the message text */}
        <div className="message-timestamp">{formattedTime}</div>
      </div>
    </div>
  );
};
export default Message;