// src/pages/ShopMenuPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { useCart } from '../context/CartContext';
import './ShopMenuPage.css';

const ShopMenuPage = () => {
  const { id } = useParams(); // This is the Shop User ID
  const [shop, setShop] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cartItems, addToCart, decreaseQuantity, cartTotal, cartCount } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- FIX #1: Use the new /shops API instead of /users ---
        // This ensures we get the 'shopDetails' including 'isOpen'
        const [shopRes, menuRes] = await Promise.all([
          api.get(`/shops/${id}`), 
          api.get(`/shops/${id}/menu`)
        ]);
        setShop(shopRes.data);
        setMenu(menuRes.data);
      } catch (err) {
        console.error("Failed to load menu", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getCartItemQty = (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    return item ? item.quantity : 0;
  };

  if (loading) return <Spinner />;
  if (!shop) return <div className="error-message">Shop not found.</div>;

  const isShopOpen = shop.shopDetails?.isOpen;

  // --- FIX #2: Proper Fallback Images with Full URLs ---
  const shopImage = shop.shopDetails?.imageUrl || "https://via.placeholder.com/100?text=Shop";

  return (
    <div className="container shop-menu-page">
      
      {/* Header */}
      <div className="menu-header">
        <img src={shopImage} alt="Shop Logo" className="menu-shop-img" />
        <div className="menu-shop-info">
            <h1>{shop.shopDetails?.shopName || shop.fullName}</h1>
            <div className="shop-status-row">
                <span className={`status-badge ${isShopOpen ? 'open' : 'closed'}`} style={{fontSize: '1rem', marginRight: '10px'}}>
                    {isShopOpen ? '● OPEN NOW' : '● CURRENTLY CLOSED'}
                </span>
                <span style={{color: '#666'}}>{shop.shopDetails?.deliveryTime || "20 mins"}</span>
            </div>
            <p>{shop.shopDetails?.description}</p>
        </div>
      </div>

      {/* Closed Banner */}
      {!isShopOpen && (
          <div style={{
              backgroundColor: '#ffe5e5', 
              color: '#d32f2f', 
              padding: '1rem', 
              borderRadius: '8px', 
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              border: '1px solid #ffcccc'
          }}>
              🚫 This shop is currently not accepting orders.
          </div>
      )}

      {/* Menu List */}
      <div className="menu-grid">
        {menu.map(item => {
          const qty = getCartItemQty(item._id);
          // --- FIX #3: Fix item image fallback ---
          const itemImage = item.imageUrl || "https://via.placeholder.com/400x200?text=Food";
          
          return (
            <div key={item._id} className="menu-item-card" style={!isShopOpen ? {opacity: 0.6, pointerEvents: 'none'} : {}}>
              <div className="menu-item-details">
                <h3>{item.title}</h3>
                <span className="price">₹{item.price}</span>
                {item.mrp && item.mrp > item.price && <span className="mrp" style={{marginLeft: '5px', textDecoration: 'line-through', color: '#999'}}>₹{item.mrp}</span>}
                <span className="desc">{item.description}</span>
              </div>
              
              <div className="menu-item-action">
                <img src={itemImage} alt={item.title} className="menu-item-img" />
                
                {qty === 0 ? (
                    <button 
                        className="add-btn" 
                        onClick={() => addToCart(item, id)}
                        disabled={!isShopOpen || !item.inStock}
                        style={(!isShopOpen || !item.inStock) ? {borderColor: '#ccc', color: '#ccc', cursor: 'not-allowed'} : {}}
                    >
                        {!isShopOpen ? "Closed" : (item.inStock ? "ADD" : "Sold Out")}
                    </button>
                ) : (
                    <div className="qty-control">
                        <button className="qty-btn" onClick={() => decreaseQuantity(item._id)}>-</button>
                        <span>{qty}</span>
                        <button className="qty-btn" onClick={() => addToCart(item, id)}>+</button>
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {menu.length === 0 && <p style={{textAlign:'center'}}>Menu is empty right now.</p>}

      {/* Floating Cart Footer */}
      {cartCount > 0 && (
        <Link to="/checkout" className="floating-cart-bar">
          <div>
            <h4>{cartCount} ITEM{cartCount > 1 ? 'S' : ''}</h4>
            <small>Extra charges may apply</small>
          </div>
          <span>View Cart &nbsp; ₹{cartTotal} &rarr;</span>
        </Link>
      )}

    </div>
  );
};

export default ShopMenuPage;