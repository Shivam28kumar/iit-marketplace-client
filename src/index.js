// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext'; // <-- IMPORT
import { ConversationProvider } from './context/ConversationContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
  <ConversationProvider> {/* <-- WRAP WITH CONVERSATION PROVIDER */}
    <SocketProvider>
      <App />
    </SocketProvider>
  </ConversationProvider>
</AuthProvider>
  </React.StrictMode>
);