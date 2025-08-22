// src/components/chat/Sidebar.js
import React, { useState, useEffect } from 'react';
import Conversation from './Conversation';
import api from '../../api/axios'; // <-- IMPORT OUR NEW API INSTANCE
import toast from 'react-hot-toast';
import { useConversation } from '../../context/ConversationContext';

const Sidebar = () => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    const getConversations = async () => {
      try {
        // Now using our 'api' instance. The base URL and auth header are handled automatically.
        const { data } = await api.get("/chat/conversations");
        setConversations(data);
      } catch (error) {
        toast.error("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []);

  return (
    <div className="sidebar-container"> {/* Use a class for styling */}
      {loading && <p style={{textAlign: 'center'}}>Loading Chats...</p>}
      {!loading && conversations.map((convo) => (
        <Conversation
          key={convo._id}
          conversation={convo}
          isSelected={selectedConversation?._id === convo._id}
          onClick={() => setSelectedConversation(convo)}
        />
      ))}
       {!loading && conversations.length === 0 && (
         <p style={{textAlign: 'center', padding: '1rem'}}>No conversations yet.</p>
       )}
    </div>
  );
};
export default Sidebar;