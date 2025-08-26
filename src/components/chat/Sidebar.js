// src/components/chat/Sidebar.js
import React, { useState, useEffect } from 'react';
import Conversation from './Conversation';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useConversation } from '../../context/ConversationContext';

const Sidebar = () => {
  const [loading, setLoading] = useState(true);
  // Get conversations and setters from the global context
  const { conversations, setConversations, selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const { data } = await api.get("/chat/conversations");
        setConversations(data);
      } catch (error) {
        toast.error("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, [setConversations]);

  return (
    <div className="sidebar-container">
      {loading && <p style={{textAlign: 'center'}}>Loading Chats...</p>}
      {!loading && conversations.map((convo) => (
        <Conversation
          key={convo._id}
          conversation={convo}
          isSelected={selectedConversation?._id === convo._id}
          onClick={() => setSelectedConversation(convo)}
        />
      ))}
      {/* ... no conversations message ... */}
    </div>
  );
};
export default Sidebar;