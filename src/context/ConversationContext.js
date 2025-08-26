// src/context/ConversationContext.js
import React, { createContext, useState, useContext } from "react";

export const ConversationContext = createContext();
export const useConversation = () => useContext(ConversationContext);

export const ConversationProvider = ({ children }) => {
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [messages, setMessages] = useState([]);
    // --- NEW: We will manage the list of conversations globally too ---
	const [conversations, setConversations] = useState([]);

	return (
		<ConversationContext.Provider 
            value={{ 
                selectedConversation, setSelectedConversation, 
                messages, setMessages,
                conversations, setConversations // Expose the new state
            }}
        >
			{children}
		</ConversationContext.Provider>
	);
};