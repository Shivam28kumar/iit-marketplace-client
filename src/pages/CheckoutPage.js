// src/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, cartTotal, cartShopId, clearCart } = useCart();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  // Loading state for shop details
  const [loadingShop, setLoadingShop] = useState(true);
  const [shopDetails, setShopDetails] = useState(null);
  
  const [deliveryDetails, setDeliveryDetails] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user info
  useEffect(() => {
      if (user) {
          setDeliveryDetails({
              name: user.fullName || '',
              phone: user.phoneNumber || '',
              address: ''
          });
      }
  }, [user]);

  // Fetch Shop Details (Crucial for Min Order Value)
  useEffect(() => {
      const fetchShopDetails = async () => {
          if (!cartShopId) { 
              setLoadingShop(false); 
              return; 
          }
          try {
              const { data } = await api.get(`/shops/${cartShopId}`); // Use the specific shop endpoint
              setShopDetails(data.shopDetails);
          } catch (err) { 
              console.error("Failed to load shop details"); 
          } finally { 
              setLoadingShop(false); 
          }
      };
      fetchShopDetails();
  }, [cartShopId]);

  const handleInputChange = (e) => {
      setDeliveryDetails({ ...deliveryDetails, [e.target.name]: e.target.value });
  };

  // --- CALCULATION LOGIC ---
  // Ensure we default to 0 if data isn't loaded yet
  const minOrderValue = shopDetails?.minOrderValue ? Number(shopDetails.minOrderValue) : 0;
  
  // Calculate Small Order Fee
  // Rule: If total is greater than 0 BUT less than minValue, apply fee.
  const smallOrderFee = (cartTotal > 0 && cartTotal < minOrderValue) ? 50 : 0;
  
  const platformFee = 5;
  const grandTotal = cartTotal + platformFee + smallOrderFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error("Cart is empty");
    
    // Validate inputs
    if (!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address) {
        return toast.error("Please fill in all delivery details.");
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        sellerId: cartShopId,
        items: cartItems.map(item => ({
          product: item._id,
          name: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        itemTotal: cartTotal,
        platformFee,
        smallOrderFee, // Send the calculated fee
        grandTotal,
        deliveryDetails
      };

      await api.post('/orders', orderData);
      
      toast.success("Order Placed Successfully! 🎉");
      clearCart();
      navigate('/my-orders'); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{textAlign: 'center', marginTop: '50px'}}>
        <h2>Your Cart is Empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/outlets')}>Browse Food Outlets</button>
      </div>
    );
  }

  // Wait for shop details to load before showing prices to avoid flickering
  if (loadingShop) return <Spinner />;

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-grid">
          <div className="checkout-form-section">
              <h3>Delivery Details</h3>
              <form id="order-form" onSubmit={handlePlaceOrder}>
                  <div className="form-group">
                      <label>Name</label>
                      <input type="text" name="name" value={deliveryDetails.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" name="phone" value={deliveryDetails.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                      <label>Hostel / Room No / Address</label>
                      <textarea name="address" rows="3" placeholder="e.g. Block A, Room 204" value={deliveryDetails.address} onChange={handleInputChange} required ></textarea>
                  </div>
              </form>
          </div>

          <div className="bill-card">
            <h3>Order from: {shopDetails?.shopName || 'Campus Outlet'}</h3>
            
            {cartItems.map(item => (
                <div key={item._id} className="bill-item">
                    <span>{item.title} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                </div>
            ))}
            
            <hr />
            
            <div className="bill-row"><span>Item Total</span><span>₹{cartTotal}</span></div>
            <div className="bill-row"><span>Platform Fee</span><span>₹{platformFee}</span></div>
            
            {/* --- FIX 2: SSL Error --- 
                (Note: This file doesn't display images, so the SSL error is likely in ShopMenuPage.js. 
                I will provide a fix for that below in the text instructions.) 
            */}

            {/* --- LOGIC DISPLAY --- */}
            {smallOrderFee > 0 && (
                <div className="bill-row" style={{color: '#dc3545', fontWeight: 'bold'}}>
                    <span>
                        Small Order Fee <br/>
                        <small style={{fontWeight:'normal', color: '#666'}}>(Orders below ₹{minOrderValue})</small>
                    </span>
                    <span>₹{smallOrderFee}</span>
                </div>
            )}
            
            <hr />
            
            <div className="bill-total"><span>TO PAY</span><span>₹{grandTotal}</span></div>

            <div className="payment-section">
                <div className="payment-option selected">Cash / UPI on Delivery</div>
            </div>

            <button type="submit" form="order-form" className="place-order-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
      </div>
    </div>
  );
};

export default CheckoutPage;