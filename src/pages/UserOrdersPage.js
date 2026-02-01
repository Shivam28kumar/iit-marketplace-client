// src/pages/UserOrdersPage.js
import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { SocketContext } from '../context/SocketContext';
import toast from 'react-hot-toast';
import notificationSound from '../assets/sounds/notification.mp3';
import './UserOrdersPage.css';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useContext(SocketContext);

  // 1. Fetch Orders on Mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/user');
        setOrders(data);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 2. Real-Time Status Listener
  useEffect(() => {
    if (socket) {
      const handleStatusUpdate = (updatedOrder) => {
        // If the order status changes to "Ready", play a sound!
        if (updatedOrder.status === 'Ready') {
            const sound = new Audio(notificationSound);
            sound.play().catch(e => console.log(e));
            toast.success(`Order from ${updatedOrder.seller.shopDetails?.shopName || 'Shop'} is READY!`);
        }

        // Update the list locally
        setOrders(prev => prev.map(order => 
          order._id === updatedOrder._id ? { ...order, status: updatedOrder.status } : order
        ));
      };

      socket.on("orderStatusUpdated", handleStatusUpdate);
      return () => socket.off("orderStatusUpdated", handleStatusUpdate);
    }
  }, [socket]);

  if (loading) return <Spinner />;

  return (
    <div className="container user-orders-page">
      <h1>My Food Orders 🍟</h1>
      
      {orders.length === 0 ? (
        <div style={{textAlign: 'center', padding: '3rem', color: '#666'}}>
    <div style={{fontSize: '3rem'}}>🍟</div>
    <h3>No orders yet</h3>
    <p>Hungry? Check out the campus outlets!</p>
    <button className="btn btn-primary" onClick={() => window.location.href='/outlets'} style={{marginTop: '1rem'}}>
        Order Food
    </button>
  </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className={`user-order-card ${order.status.toLowerCase()}`}>
              
              <div className="order-top-row">
                <div>
                  {/* Shop Name */}
                  <div className="shop-name">{order.seller?.shopDetails?.shopName || order.seller?.fullName}</div>
                  <div className="order-date">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="order-status-badge">
                  {order.status}
                </div>
              </div>

              <div className="order-items-list">
                {order.items.map((item, idx) => (
                  <div key={idx} style={{fontSize: '0.9rem', marginBottom: '4px'}}>
                    {item.quantity} x {item.name || item.productName}
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <span>Total Paid:</span>
                <span>₹{order.grandTotal}</span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;