// src/components/chat/MessageContainer.js
import React, { useEffect, useState, useRef } from 'react';
import { useConversation } from '../../context/ConversationContext';
import { useAuthContext } from '../../context/AuthContext'; // Correctly imported
import api from '../../api/axios';
import toast from 'react-hot-toast';
import useListenMessages from '../../hooks/useListenMessages';
import MessageInput from './MessageInput';
import Message from './Message';
import { FaComments, FaArrowLeft } from 'react-icons/fa'; // Correctly imported
import './MessageContainer.css';


const MessageContainer = () => {
  // --- STATE AND CONTEXT HOOKS ---
  // THE FIX: We destructure 'setSelectedConversation' from the context so we can use it.
  const { selectedConversation, setSelectedConversation, messages, setMessages } = useConversation();
  const [loading, setLoading] = useState(false);
  useListenMessages(); // This hook handles receiving real-time messages.
  const lastMessageRef = useRef(); // A ref to auto-scroll to the latest message.

  // --- DATA FETCHING AND SIDE EFFECTS ---

  // Fetches the message history when a user selects a new conversation.
  useEffect(() => {
    const getMessages = async () => {
      if (selectedConversation) {
        setLoading(true);
        setMessages([]); // Clear out old messages before fetching new ones.
        try {
          // THE FIX (Cleanup): We no longer need to create unused variables here.
          // We directly use the properties from the selectedConversation object.
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

  // Handles auto-scrolling whenever the messages array is updated.
  useEffect(() => {
    const timer = setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // --- EVENT HANDLERS ---

  // Called when the user sends a message from the MessageInput component.
  const handleSendMessage = async (message) => {
    if (!selectedConversation) return;
    try {
      const otherParticipantId = selectedConversation.participants[0]._id;
      const productId = selectedConversation.product._id;
      const res = await api.post(`/chat/send/${otherParticipantId}`, { message, productId });
      setMessages([...messages, res.data]);
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  // Called when the user clicks the "Call Owner" button.
  const handleCallOwner = async () => {
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

  // --- RENDER LOGIC ---
  return (
    <div className="message-container">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="chat-header">
            {/* The "Back" button for mobile. It works by clearing the selected conversation. */}
            <button className="back-button" onClick={() => setSelectedConversation(null)}>
              <FaArrowLeft />
            </button>
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

// A separate component for the placeholder text.
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