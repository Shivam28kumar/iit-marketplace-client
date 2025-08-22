// src/components/chat/MessageContainer.js
import React, { useEffect, useState, useRef } from 'react';
import { useConversation } from '../../context/ConversationContext';
import { useAuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import useListenMessages from '../../hooks/useListenMessages';
import MessageInput from './MessageInput';
import Message from './Message';
import { FaComments } from 'react-icons/fa';
import './MessageContainer.css';



const MessageContainer = () => {
  const { selectedConversation, messages, setMessages } = useConversation();
  const [loading, setLoading] = useState(false);
  useListenMessages();
  const lastMessageRef = useRef();

  // Fetches the message history for the selected conversation and product.
  useEffect(() => {
    const getMessages = async () => {
      // We only proceed if a conversation is selected.
      if (selectedConversation) {
        setLoading(true);
        setMessages([]); // Clear previous messages
        try {
          // --- FIX #1 ---
          // The API needs to know the other user's ID AND the product's ID
          // to fetch the correct message history.
          const otherParticipantId = selectedConversation.participants[0]._id;
          const productId = selectedConversation.product._id;
          
          const res = await api.get(`/chat/${selectedConversation.participants[0]._id}`, {
            params: { productId: selectedConversation.product._id }
          });

          setMessages(res.data);
        } catch (error) {
          toast.error("Failed to load messages.");
        } finally {
          setLoading(false);
        }
      }
    };
    getMessages();
  }, [selectedConversation, setMessages]);

  // Handles auto-scrolling
  useEffect(() => {
    const timer = setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Handles sending a new message.
  const handleSendMessage = async (message) => {
    if (!selectedConversation) return;
    try {
      const otherParticipantId = selectedConversation.participants[0]._id;
      // --- FIX #2 ---
      // We get the productId from the currently selected conversation object.
      const productId = selectedConversation.product._id;
      
      // We send both the 'message' and the 'productId' to the backend.
      // This fixes the "product: Path 'product' is required" error.
      const res = await api.post(`/chat/send/${otherParticipantId}`, { message, productId });
      
      setMessages([...messages, res.data]);
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  const handleCallOwner = async () => {
    // ... (This function is correct and unchanged)
    if (!selectedConversation) return;
    try {
      const otherUserId = selectedConversation.participants[0]._id;
      const res = await api.get(`/users/contact/${otherUserId}`);
      const phoneNumber = res.data.phoneNumber;
      toast.custom(
        (t) => (
          <div className="call-toast">
            Seller's number: <strong>{phoneNumber}</strong>
            <a href={`tel:${phoneNumber}`}>Call Now</a>
            <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
          </div>
        ),
        { duration: 10000 }
      );
    } catch (error) {
      const message = error.response ? error.response.data.message : "Could not fetch contact details.";
      toast.error(message);
    }
  };

  return (
    <div className="message-container">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="chat-header">
            <div className="chat-header-info">
              <p className="seller-name">{selectedConversation.participants[0].fullName}</p>
              {selectedConversation.product && (
                <p className="product-title">
                  RE: {selectedConversation.product.title} - ₹{selectedConversation.product.price}
                </p>
              )}
            </div>
            <div className="chat-header-actions">
              <button onClick={handleCallOwner} className="call-button">Call Owner</button>
            </div>
          </div>
          <div className="messages-list">
            {loading && <p style={{ textAlign: "center" }}>Loading messages...</p>}
            {!loading && messages.map((msg, index) => (
              <div key={msg._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
                <Message message={msg} />
              </div>
            ))}
            {!loading && messages.length === 0 && (
              <p style={{ textAlign: "center" }}>No messages yet. Say hello!</p>
            )}
          </div>
          <MessageInput onSendMessage={handleSendMessage} />
        </>
      )}
    </div>
  );
};

// The NoChatSelected component remains the same.
const NoChatSelected = () => {
  const { user } = useAuthContext();
  return (
    <div className="no-chat-selected">
      <FaComments />
      <h3>Welcome, {user ? user.fullName : ''}!</h3>
      <p>Select a conversation from the sidebar to start chatting.</p>
    </div>
  );
};

export default MessageContainer;