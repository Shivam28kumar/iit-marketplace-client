// src/components/chat/MessageContainer.js
import React, { useEffect, useState, useRef } from 'react';
import { useConversation } from '../../context/ConversationContext';
import { useAuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import MessageInput from './MessageInput';
import Message from './Message'; // This is now used
import { FaComments, FaArrowLeft } from 'react-icons/fa'; // This is now used
import './MessageContainer.css';

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation, messages, setMessages } = useConversation();
  const { user, fetchUnreadCount } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef();

  // Effect to fetch messages and mark them as read
  useEffect(() => {
    const getMessagesAndMarkRead = async () => {
      if (selectedConversation) {
        setLoading(true);
        try {
          const otherParticipantId = selectedConversation.participants[0]._id;
          // These API calls are the core logic for this effect
          await api.put(`/chat/read/${otherParticipantId}`);
          fetchUnreadCount(); // Update the global badge
          const res = await api.get(`/chat/${otherParticipantId}`, {
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
    getMessagesAndMarkRead();
  }, [selectedConversation, setMessages, fetchUnreadCount]);

  // Effect for auto-scrolling
  useEffect(() => {
    const timer = setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Handler for sending a new message
  const handleSendMessage = async (message) => {
    if (!selectedConversation) return;
    try {
      const res = await api.post(`/chat/send/${selectedConversation.participants[0]._id}`, {
        message,
        productId: selectedConversation.product._id,
      });
      setMessages((prevMessages) => [...prevMessages, res.data]);
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  // Handler for the "Call Owner" button
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
        ), { duration: 10000 }
      );
    } catch (error) {
      const message = error.response ? error.response.data.message : "Could not fetch details.";
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
            <button className="back-button" onClick={() => setSelectedConversation(null)}>
              <FaArrowLeft />
            </button>
            <div className="chat-header-info">
              <p className="seller-name">{selectedConversation.participants[0].fullName}</p>
              {selectedConversation.product && (
                <p className="product-title">RE: {selectedConversation.product.title}</p>
              )}
            </div>
            <div className="chat-header-actions">
              <button onClick={handleCallOwner} className="call-button">Call Owner</button>
            </div>
          </div>
          <div className="messages-list">
            {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
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

// Sub-component for the placeholder view
const NoChatSelected = () => {
  const { user } = useAuthContext();
  return (
    <div className="no-chat-selected">
      <FaComments />
      <h3>Welcome, {user ? user.fullName : ''}!</h3>
      <p>Select a conversation to start chatting.</p>
    </div>
  );
};

export default MessageContainer;