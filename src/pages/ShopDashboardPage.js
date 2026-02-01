// src/pages/ShopDashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { SocketContext } from '../context/SocketContext';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import './ShopDashboardPage.css';
import notificationSound from '../assets/sounds/notification.mp3';

const ShopDashboardPage = () => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'menu', 'settings'
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopStatus, setShopStatus] = useState(true); // Track Open/Close
  
  const socket = useContext(SocketContext);
  const { user } = useAuthContext();

  // --- FORM STATE FOR MENU ITEMS ---
  const [itemForm, setItemForm] = useState({ 
    id: null, // If null, creating. If set, editing.
    title: '', description: '', price: '', mrp: '', category: 'Snacks' 
  });
  const [itemImage, setItemImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [editingItem, setEditingItem] = useState(null);

  // --- FORM STATE FOR SETTINGS ---
  const [settingsForm, setSettingsForm] = useState({
      shopName: '', description: '', deliveryTime: '', minOrderValue: '', phoneNumber: ''
  });

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, menuRes, userRes] = await Promise.all([
            api.get('/orders/shop'),
            api.get(`/products/user/${user.id}`),
            api.get('/users/me') // Fetch latest details for settings/status
        ]);
        setOrders(ordersRes.data);
        setMenuItems(menuRes.data);
        
        const userData = userRes.data;
        // Initialize Shop Status
        setShopStatus(userData.shopDetails?.isOpen || false);
        
        // Initialize Settings Form with existing data
        setSettingsForm({
            shopName: userData.shopDetails?.shopName || '',
            description: userData.shopDetails?.description || '',
            deliveryTime: userData.shopDetails?.deliveryTime || '',
            minOrderValue: userData.shopDetails?.minOrderValue || 0,
            phoneNumber: userData.phoneNumber || ''
        });

      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  // --- REAL TIME ORDERS (Socket) ---
  useEffect(() => {
    if (socket) {
      const handleNewOrder = (newOrder) => {
        const sound = new Audio(notificationSound);
        sound.play().catch(e => console.log("Audio blocked"));
        toast.success(`New Order Received! ₹${newOrder.grandTotal}`);
        setOrders(prev => [newOrder, ...prev]);
      };
      socket.on("newOrder", handleNewOrder);
      return () => socket.off("newOrder", handleNewOrder);
    }
  }, [socket]);

  // --- ACTIONS: SHOP STATUS ---
  const handleToggleShop = async () => {
      try {
          const { data } = await api.put('/shops/status');
          setShopStatus(data.isOpen);
          toast.success(data.message);
      } catch (err) {
          toast.error("Failed to change shop status");
      }
  };

  // --- ACTIONS: ORDER MANAGEMENT ---
  const updateOrder = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: data.status } : o));
    } catch (err) { toast.error("Failed to update status"); }
  };

  // --- ACTIONS: MENU MANAGEMENT ---
  const handleEditClick = (item) => {
      setEditingItem(item);
      setItemForm({
          id: item._id,
          title: item.title, description: item.description, 
          price: item.price, mrp: item.mrp || '', category: item.category 
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
      setItemForm({ id: null, title: '', description: '', price: '', mrp: '', category: 'Snacks' });
      setItemImage(null);
      setEditingItem(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (itemForm.mrp && Number(itemForm.price) > Number(itemForm.mrp)) {
        return toast.error("Selling Price cannot be higher than MRP");
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', itemForm.title);
    formData.append('description', itemForm.description);
    formData.append('price', itemForm.price);
    if(itemForm.mrp) formData.append('mrp', itemForm.mrp);
    formData.append('category', itemForm.category);
    if (itemImage) formData.append('image', itemImage);

    try {
        if (itemForm.id) {
            // Update Existing Item
            const { data } = await api.put(`/products/${itemForm.id}`, formData);
            setMenuItems(prev => prev.map(item => item._id === data._id ? data : item));
            toast.success("Item updated successfully!");
        } else {
            // Create New Item
            if (!itemImage) { setIsSubmitting(false); return toast.error("Image required for new items"); }
            const { data } = await api.post('/products', formData);
            setMenuItems(prev => [data, ...prev]);
            toast.success("Item added to menu!");
        }
        handleCancelEdit();
    } catch (err) { toast.error("Operation failed"); } 
    finally { setIsSubmitting(false); }
  };

  const handleDeleteItem = async (productId) => {
      if(!window.confirm("Delete this item?")) return;
      try {
          await api.delete(`/products/${productId}`);
          setMenuItems(prev => prev.filter(p => p._id !== productId));
          toast.success("Item deleted");
      } catch(err) { toast.error("Failed to delete"); }
  };

  // --- ACTIONS: SETTINGS MANAGEMENT ---
  const handleSettingsSubmit = async (e) => {
      e.preventDefault();
      try {
          await api.put('/shops/settings', settingsForm);
          toast.success("Shop settings updated successfully!");
      } catch (err) {
          toast.error("Failed to update settings.");
      }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container shop-dashboard">
      
      {/* Header Row */}
      <div className="dashboard-header-row">
          <h1>Shop Dashboard</h1>
          {/* Shop Open/Close Toggle */}
          <div className="shop-status-toggle">
              <span className={shopStatus ? "status-text open" : "status-text closed"}>
                  {shopStatus ? "ONLINE" : "OFFLINE"}
              </span>
              <label className="switch">
                  <input type="checkbox" checked={shopStatus} onChange={handleToggleShop} />
                  <span className="slider round"></span>
              </label>
          </div>
      </div>

      {/* Tabs Navigation */}
      <div className="dashboard-header-tabs">
        <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
        >
            Live Orders ({orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length})
        </button>
        <button 
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
        >
            Menu Management
        </button>
        <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
        >
            Settings
        </button>
      </div>

      {/* --- TAB 1: LIVE ORDERS --- */}
      {activeTab === 'orders' && (
          <div className="orders-list">
             {orders.length === 0 && <p className="no-orders">No active orders right now.</p>}
             {orders.map(order => (
              <div key={order._id} className={`order-card ${order.status.toLowerCase()}`}>
                 
                 {/* Order Header (ID, Time, Status) */}
                 <div className="order-header">
                    <span className="order-id">#{order._id.slice(-4)}</span>
                    <span className="order-time">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className={`status-tag ${order.status.toLowerCase()}`}>{order.status}</span>
                 </div>
                 
                 {/* Delivery Details (Critical Info) */}
                 <div className="customer-info" style={{marginTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee'}}>
                     <div style={{fontSize: '1.1rem', fontWeight: 'bold', color: '#333'}}>
                         {order.deliveryDetails?.name || order.buyer?.fullName}
                     </div>
                     <div style={{color: '#007bff', fontWeight: '500', marginTop: '4px'}}>
                         📞 <a href={`tel:${order.deliveryDetails?.phone}`} style={{textDecoration:'none', color:'inherit'}}>{order.deliveryDetails?.phone || 'No Phone'}</a>
                     </div>
                     <div style={{marginTop: '8px', backgroundColor: '#fff3cd', padding: '8px', borderRadius: '5px', fontSize: '0.95rem', border: '1px solid #ffeeba', color: '#856404'}}>
                         📍 <strong>Address:</strong> {order.deliveryDetails?.address || 'No Address Provided'}
                     </div>
                 </div>

                 {/* Order Items */}
                 <div className="order-items">
                    {order.items.map((i,x) => (
                        <div key={x} className="order-item-row">
                            <strong>{i.quantity} x</strong> {i.name}
                        </div>
                    ))}
                 </div>
                 <div className="order-total">Total: ₹{order.grandTotal} ({order.paymentMode})</div>
                 
                 {/* Order Action Buttons */}
                 <div className="order-actions">
                     {order.status === 'Pending' && (
                        <>
                            <button className="btn-reject" onClick={() => updateOrder(order._id, 'Cancelled')}>Reject</button>
                            <button className="btn-accept" onClick={() => updateOrder(order._id, 'Preparing')}>Accept</button>
                        </>
                     )}
                     {order.status === 'Preparing' && (
                        <button className="btn-ready" onClick={() => updateOrder(order._id, 'Ready')}>Mark Ready</button>
                     )}
                     {order.status === 'Ready' && (
                        <button className="btn-done" onClick={() => updateOrder(order._id, 'Completed')}>Delivered / Picked Up</button>
                     )}
                 </div>
              </div>
             ))}
          </div>
      )}

      {/* --- TAB 2: MENU MANAGEMENT --- */}
      {activeTab === 'menu' && (
          <div className="menu-management">
              
              {/* Add/Edit Form */}
              <div className="add-item-card">
                  <h3>{editingItem ? "Edit Item" : "Add New Item"}</h3>
                  <form onSubmit={handleFormSubmit} className="add-item-form">
                      <input type="text" placeholder="Item Name" value={itemForm.title} onChange={e => setItemForm({...itemForm, title: e.target.value})} required />
                      <input type="text" placeholder="Description" value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} required />
                      <div className="form-row">
                          <input type="number" placeholder="Selling Price (₹)" value={itemForm.price} onChange={e => setItemForm({...itemForm, price: e.target.value})} required />
                          <input type="number" placeholder="MRP (Optional)" value={itemForm.mrp} onChange={e => setItemForm({...itemForm, mrp: e.target.value})} />
                          <select value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})}>
                              <option value="Snacks">Snacks</option>
                              <option value="Beverages">Beverages</option>
                              <option value="Meals">Meals</option>
                              <option value="Desserts">Desserts</option>
                          </select>
                      </div>
                      <div className="form-file-group">
                        <label>{itemForm.id ? "Change Image (Optional)" : "Upload Image"}</label>
                        <input type="file" accept="image/*" onChange={e => setItemImage(e.target.files[0])} />
                      </div>
                      <div className="form-actions">
                          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                              {isSubmitting ? 'Saving...' : (itemForm.id ? 'Update Item' : 'Add Item')}
                          </button>
                          {editingItem && <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">Cancel Edit</button>}
                      </div>
                  </form>
              </div>

              {/* Menu List */}
              <h3>Current Menu</h3>
              <div className="menu-items-list">
                  {menuItems.map(item => (
                      <div key={item._id} className="shop-item-row">
                          <img src={item.imageUrl} alt={item.title} />
                          <div className="item-info">
                              <h4>{item.title}</h4>
                              <div className="item-pricing">
                                  <span className="selling-price">₹{item.price}</span>
                                  {item.mrp && item.mrp > item.price && (
                                      <><span className="mrp">₹{item.mrp}</span><span className="discount-tag">{Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF</span></>
                                  )}
                              </div>
                          </div>
                          <div className="item-actions">
                              <button className="btn-edit" onClick={() => handleEditClick(item)}>Edit</button>
                              <button className="btn-delete" onClick={() => handleDeleteItem(item._id)}>Delete</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- TAB 3: SETTINGS (NEW) --- */}
      {activeTab === 'settings' && (
          <div className="menu-management">
              <div className="add-item-card">
                  <h3>Shop Settings</h3>
                  <form onSubmit={handleSettingsSubmit} className="add-item-form">
                      <div className="form-group">
                          <label>Display Shop Name</label>
                          <input type="text" value={settingsForm.shopName} onChange={e => setSettingsForm({...settingsForm, shopName: e.target.value})} required />
                      </div>
                      <div className="form-group">
                          <label>Tagline / Description</label>
                          <input type="text" value={settingsForm.description} onChange={e => setSettingsForm({...settingsForm, description: e.target.value})} required />
                      </div>
                      <div className="form-row">
                          <div className="form-group" style={{flex: 1}}>
                              <label>Delivery Time Text</label>
                              <input type="text" value={settingsForm.deliveryTime} onChange={e => setSettingsForm({...settingsForm, deliveryTime: e.target.value})} placeholder="e.g. 15-20 mins" required />
                          </div>
                          <div className="form-group" style={{flex: 1}}>
                              <label>Minimum Order Value (₹)</label>
                              <input type="number" value={settingsForm.minOrderValue} onChange={e => setSettingsForm({...settingsForm, minOrderValue: e.target.value})} placeholder="0" />
                          </div>
                      </div>
                      <div className="form-group">
                          <label>Shop Phone Number (For Orders)</label>
                          <input type="tel" value={settingsForm.phoneNumber} onChange={e => setSettingsForm({...settingsForm, phoneNumber: e.target.value})} />
                      </div>
                      <button type="submit" className="btn btn-primary">Save Settings</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default ShopDashboardPage;