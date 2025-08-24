// src/pages/ChatPage.js
        import React from 'react';
        import MessageContainer from '../components/chat/MessageContainer';
        import Sidebar from '../components/chat/Sidebar';
        import { useConversation } from '../context/ConversationContext'; // Import the context
        import './ChatPage.css';

        const ChatPage = () => {
          const { selectedConversation } = useConversation();
          return (
            // The class changes when a conversation is selected, triggering the CSS transition
            <div className={`chat-container ${selectedConversation ? 'show-messages' : ''}`}>
              <Sidebar />
              <MessageContainer />
            </div>
          );
        };
        export default ChatPage;