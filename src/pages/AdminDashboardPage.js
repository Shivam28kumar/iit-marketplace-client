// src/pages/AdminDashboardPage.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]); // <-- NEW: State for shops
  const [products, setProducts] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms State
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('');
  const [newBannerImage, setNewBannerImage] = useState(null);

  // NEW: State for the "Create Shop" form
  const [shopForm, setShopForm] = useState({
      fullName: '', email: '', password: '', shopName: '', description: '', deliveryTime: ''
  });
  const [shopImage, setShopImage] = useState(null);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    try {
      const [usersRes, productsRes, collegesRes, bannersRes] = await Promise.all([
        api.get('/admin/users'), // This returns ALL users (shops + regular)
        api.get('/products'),
        api.get('/colleges'),
        api.get('/banners'),
      ]);

      // Separate Shops from Regular Users for cleaner display
      const allUsers = usersRes.data;
      setUsers(allUsers.filter(u => u.role === 'user'));
      setShops(allUsers.filter(u => u.role === 'shop'));
      
      setProducts(productsRes.data);
      setColleges(collegesRes.data);
      setBanners(bannersRes.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLER FUNCTIONS ---

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete User?')) {
      try { await api.delete(`/admin/users/${userId}`); toast.success('User deleted.'); setUsers(prev => prev.filter(u => u._id !== userId)); } 
      catch (error) { toast.error('Failed to delete user.'); }
    }
  };

  // ... (handleDeleteProduct, handleDeleteCollege, handleAddCollege, handleDeleteBanner, handleAddBanner remain the same as your old code) ...
  const handleDeleteProduct = async (id) => { if(window.confirm('Delete?')) { try { await api.delete(`/admin/products/${id}`); toast.success('Deleted'); setProducts(p=>p.filter(x=>x._id!==id)); } catch(e){toast.error('Failed');} } };
  const handleDeleteCollege = async (id) => { if(window.confirm('Delete?')) { try { await api.delete(`/admin/colleges/${id}`); toast.success('Deleted'); setColleges(p=>p.filter(x=>x._id!==id)); } catch(e){toast.error('Failed');} } };
  const handleDeleteBanner = async (id) => { if(window.confirm('Delete?')) { try { await api.delete(`/admin/banners/${id}`); toast.success('Deleted'); setBanners(p=>p.filter(x=>x._id!==id)); } catch(e){toast.error('Failed');} } };
  const handleAddCollege = async (e) => { e.preventDefault(); if(!newCollegeName.trim()) return; try { await api.post('/admin/colleges', {name:newCollegeName}); toast.success('Added'); setNewCollegeName(''); fetchData(); } catch(e){toast.error('Failed');} };
  const handleBannerImageChange = (e) => { setNewBannerImage(e.target.files[0]); };
  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newBannerImage || !newBannerLink.trim()) return toast.error("Image and Link required");
    const fd = new FormData(); fd.append('image', newBannerImage); fd.append('linkUrl', newBannerLink);
    try { await api.post('/admin/banners', fd); toast.success('Banner added'); setNewBannerImage(null); setNewBannerLink(''); document.getElementById('banner-image-input').value = null; fetchData(); } catch(e){toast.error('Failed');}
  };


  // --- NEW HANDLERS FOR SHOPS ---
  const handleShopChange = (e) => setShopForm({...shopForm, [e.target.name]: e.target.value});
  const handleShopImageChange = (e) => setShopImage(e.target.files[0]);

  const handleAddShop = async (e) => {
      e.preventDefault();
      if(!shopImage) return toast.error("Shop Logo is required");

      const formData = new FormData();
      Object.keys(shopForm).forEach(key => formData.append(key, shopForm[key]));
      formData.append('image', shopImage);

      try {
          const { data } = await api.post('/admin/shops', formData);
          setShops(prev => [...prev, data]);
          toast.success("Shop created successfully!");
          setShopForm({ fullName: '', email: '', password: '', shopName: '', description: '', deliveryTime: '' });
          setShopImage(null);
          document.getElementById('shop-image-input').value = null;
      } catch (err) {
          toast.error(err.response?.data?.message || "Failed to create shop");
      }
  };

  const handleDeleteShop = async (id) => {
      if(window.confirm('Delete this Shop?')) {
          try {
              await api.delete(`/admin/shops/${id}`);
              setShops(prev => prev.filter(s => s._id !== id));
              toast.success("Shop deleted.");
          } catch(e) { toast.error("Failed to delete shop"); }
      }
  };


  if (loading) return <Spinner />;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* --- NEW: SHOP MANAGEMENT SECTION --- */}
      <section className="admin-section">
        <h2>Shop Management ({shops.length})</h2>
        <div className="banner-management-grid"> 
            
            {/* Shop List Table */}
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Logo</th>
                            <th>Shop Name</th>
                            <th>Owner Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shops.map(shop => (
                            <tr key={shop._id}>
                                <td><img src={shop.shopDetails?.imageUrl} alt="logo" className="admin-table-img"/></td>
                                <td>{shop.shopDetails?.shopName}</td>
                                <td>{shop.email}</td>
                                <td><button onClick={() => handleDeleteShop(shop._id)} className="delete-btn-admin">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Shop Form */}
            <div className="add-college-form">
                <h3>Register New Shop</h3>
                <form onSubmit={handleAddShop}>
                    <div className="form-group">
                        <label>Owner Full Name</label>
                        <input type="text" name="fullName" value={shopForm.fullName} onChange={handleShopChange} required />
                    </div>
                    <div className="form-group">
                        <label>Login Email</label>
                        <input type="email" name="email" value={shopForm.email} onChange={handleShopChange} required />
                    </div>
                    <div className="form-group">
                        <label>Login Password</label>
                        <input type="password" name="password" value={shopForm.password} onChange={handleShopChange} required />
                    </div>
                    <hr style={{margin: '1rem 0', border: '0', borderTop: '1px solid #eee'}}/>
                    <div className="form-group">
                        <label>Display Shop Name</label>
                        <input type="text" name="shopName" value={shopForm.shopName} onChange={handleShopChange} placeholder="e.g. Night Canteen" required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" name="description" value={shopForm.description} onChange={handleShopChange} placeholder="e.g. Burgers & Shakes" required />
                    </div>
                    <div className="form-group">
                        <label>Shop Logo</label>
                        <input id="shop-image-input" type="file" accept="image/*" onChange={handleShopImageChange} required />
                    </div>
                    <button type="submit">Create Shop</button>
                </form>
            </div>
        </div>
      </section>

      {/* --- Banner Management Section --- */}
      <section className="admin-section">
        <h2>Promotional Banner Management ({banners.length})</h2>
        <div className="banner-management-grid">
          <div className="table-container">
            <table className="admin-table">
              <thead><tr><th>Banner Image</th><th>Link URL</th><th>Actions</th></tr></thead>
              <tbody>
                {banners.map(banner => (
                  <tr key={banner._id}>
                    <td><img src={banner.imageUrl} alt="Banner" className="admin-table-img"/></td>
                    <td>{banner.linkUrl}</td>
                    <td><button onClick={() => handleDeleteBanner(banner._id)} className="delete-btn-admin">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="add-college-form">
            <h3>Add New Banner</h3>
            <form onSubmit={handleAddBanner}>
              <div className="form-group">
                <label htmlFor="banner-image-input">Banner Image</label>
                <input id="banner-image-input" type="file" accept="image/*" onChange={handleBannerImageChange} required />
                <small>For best results, use a wide, landscape-oriented image.</small>
              </div>
              <div className="form-group">
                <label htmlFor="banner-link-input">Link URL</label>
                <input id="banner-link-input" type="text" value={newBannerLink} onChange={(e) => setNewBannerLink(e.target.value)} placeholder="/product/some_id" required />
              </div>
              <button type="submit">Add Banner</button>
            </form>
          </div>
        </div>
      </section>

      {/* --- College Management Section --- */}
      <section className="admin-section">
        <h2>College Management ({colleges.length})</h2>
        <div className="college-management-grid">
          <div className="table-container">
            <table className="admin-table">
              <thead><tr><th>College Name</th><th>Actions</th></tr></thead>
              <tbody>
                {colleges.map(college => (
                  <tr key={college._id}>
                    <td>{college.name}</td>
                    <td><button onClick={() => handleDeleteCollege(college._id)} className="delete-btn-admin">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="add-college-form">
            <h3>Add New College</h3>
            <form onSubmit={handleAddCollege}>
              <input type="text" value={newCollegeName} onChange={(e) => setNewCollegeName(e.target.value)} placeholder="Enter new college name" />
              <button type="submit">Add College</button>
            </form>
          </div>
        </div>
      </section>

      {/* --- Product Management Section --- */}
      <section className="admin-section">
        <h2>Product Management ({products.length})</h2>
        <div className="table-container">
          <table className="admin-table">
            <thead><tr><th>Image</th><th>Title</th><th>Price</th><th>Seller</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td><img src={product.imageUrl} alt={product.title} className="admin-table-img"/></td>
                  <td>{product.title}</td>
                  <td>₹{product.price}</td>
                  <td>{product.user?.fullName || 'N/A'}</td>
                  <td><button onClick={() => handleDeleteProduct(product._id)} className="delete-btn-admin">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
      {/* --- User Management Section --- */}
      <section className="admin-section">
        <h2>User Management ({users.length})</h2>
        <div className="table-container">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>College</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.college?.name || 'N/A'}</td>
                  <td>{user.role}</td>
                  <td><button onClick={() => handleDeleteUser(user._id)} className="delete-btn-admin">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;