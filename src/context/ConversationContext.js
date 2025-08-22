// src/context/ConversationContext.js
import { createContext, useState, useContext } from "react";

export const ConversationContext = createContext();

// Custom hook to easily access the context
export const useConversation = () => {
	return useContext(ConversationContext);
};

export const ConversationProvider = ({ children }) => {
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [messages, setMessages] = useState([]);

	return (
		<ConversationContext.Provider value={{ selectedConversation, setSelectedConversation, messages, setMessages }}>
			{children}
		</ConversationContext.Provider>
	);
};