// src/components/chat/MessageInput.js
import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import './MessageInput.css';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const quickReplies = ["Hello!", "Is it available?", "Okay", "No problem"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleQuickReply = (reply) => {
    onSendMessage(reply);
  };

  return (
    <div className="message-input-container">
      <div className="quick-replies">
        {quickReplies.map(reply => (
          <button key={reply} onClick={() => handleQuickReply(reply)} className="quick-reply-btn">
            {reply}
          </button>
        ))}
      </div>
      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit"><FaPaperPlane /></button>
      </form>
    </div>
  );
};
export default MessageInput;