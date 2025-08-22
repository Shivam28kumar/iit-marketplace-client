// src/pages/ChatPage.js
import React from 'react';
import MessageContainer from '../components/chat/MessageContainer';
import Sidebar from '../components/chat/Sidebar'; // Import our new Sidebar
import './ChatPage.css';

const ChatPage = () => {
  return (
    <div className="chat-container">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};

export default ChatPage;