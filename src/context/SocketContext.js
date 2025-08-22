// src/context/SocketContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useAuthContext } from '../context/AuthContext'; // We need the user's auth status

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, logout } = useAuthContext(); // Get the logged-in user

  useEffect(() => {
    // Only establish a connection if there is a logged-in user
    if (user) {
      // Connect to the backend socket.io server
      const newSocket = io('http://localhost:5000', {
        query: {
          userId: user.id,
        },
      });
      setSocket(newSocket);
      // This is how we clean up the connection when the component unmounts
      // or when the user logs out.
      return () => newSocket.close();
    } else {
      // If there's no user, make sure there's no active socket connection
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]); // This effect depends on the 'user' object

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};