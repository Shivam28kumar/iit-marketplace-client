// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ConversationProvider } from './context/ConversationContext';
import { CartProvider } from './context/CartContext'; // 1. Import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ConversationProvider>
        <SocketProvider>
          {/* 2. Wrap App with CartProvider */}
          <CartProvider>
            <App />
          </CartProvider>
        </SocketProvider>
      </ConversationProvider>
    </AuthProvider>
  </React.StrictMode>
);