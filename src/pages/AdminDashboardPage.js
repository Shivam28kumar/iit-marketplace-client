// src/pages/AdminDashboardPage.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [banners, setBanners] = useState([]); // <-- NEW STATE for banners
  const [loading, setLoading] = useState(true);
  
  // State for the "Add College" form
  const [newCollegeName, setNewCollegeName] = useState('');
  // NEW: State for the "Add Banner" form
  const [newBannerLink, setNewBannerLink] = useState('');
  const [newBannerImage, setNewBannerImage] = useState(null);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    // On re-fetches, we don't need to show the main spinner, so we don't set loading to true here.
    try {
      // Use Promise.all to fetch all data in parallel for better performance.
      const [usersRes, productsRes, collegesRes, bannersRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/products'),
        api.get('/colleges'),
        api.get('/banners'), // <-- NEW API call to get all banners for the admin view
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setColleges(collegesRes.data);
      setBanners(bannersRes.data);
    } catch (error) {
      toast.error("Failed to fetch all dashboard data.");
    } finally {
      setLoading(false); // Stop the main spinner after the initial fetch.
    }
  };

  // This useEffect runs only once when the component first mounts.
  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLER FUNCTIONS ---

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success('User deleted.');
        setUsers(prev => prev.filter(u => u._id !== userId));
      } catch (error) { toast.error('Failed to delete user.'); }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${productId}`);
        toast.success('Product deleted.');
        setProducts(prev => prev.filter(p => p._id !== productId));
      } catch (error) { toast.error('Failed to delete product.'); }
    }
  };

  const handleDeleteCollege = async (collegeId) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        await api.delete(`/admin/colleges/${collegeId}`);
        toast.success('College deleted.');
        setColleges(prev => prev.filter(c => c._id !== collegeId));
      } catch (error) { toast.error('Failed to delete college.'); }
    }
  };

  const handleAddCollege = async (e) => {
    e.preventDefault();
    if (!newCollegeName.trim()) return;
    try {
      await api.post('/admin/colleges', { name: newCollegeName });
      toast.success('College added successfully.');
      setNewCollegeName('');
      fetchData(); // Re-fetch data to show the newly added college.
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add college.');
    }
  };

  const handleBannerImageChange = (e) => {
    setNewBannerImage(e.target.files[0]);
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newBannerImage || !newBannerLink.trim()) {
      return toast.error("Please provide both an image and a link URL.");
    }
    const formData = new FormData();
    formData.append('image', newBannerImage);
    formData.append('linkUrl', newBannerLink);
    try {
      await api.post('/admin/banners', formData);
      toast.success('Banner added successfully!');
      // Reset form fields
      setNewBannerImage(null);
      setNewBannerLink('');
      if(document.getElementById('banner-image-input')) {
        document.getElementById('banner-image-input').value = null;
      }
      fetchData(); // Re-fetch data to show the new banner.
    } catch (error) {
      toast.error('Failed to add banner.');
    }
  };
  
  const handleDeleteBanner = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
        try {
            await api.delete(`/admin/banners/${bannerId}`);
            toast.success('Banner deleted.');
            setBanners(prev => prev.filter(b => b._id !== bannerId));
        } catch (error) {
            toast.error('Failed to delete banner.');
        }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {/* --- NEW: Banner Management Section --- */}
      <section className="admin-section">
        <h2>Promotional Banner Management ({banners.length})</h2>
        <div className="banner-management-grid">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Banner Image</th>
                  <th>Link URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
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
          <div className="add-college-form"> {/* Reusing styles */}
            <h3>Add New Banner</h3>
            <form onSubmit={handleAddBanner}>
              <div className="form-group">
                <label htmlFor="banner-image-input">Banner Image</label>
                <input id="banner-image-input" type="file" accept="image/*" onChange={handleBannerImageChange} required />
                <small>For best results, use a wide, landscape-oriented image (e.g., 1200px wide by 400px tall).</small>
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

      {/* --- Existing Sections Below --- */}

      <section className="admin-section">
        <h2>College Management ({colleges.length})</h2>
        <div className="college-management-grid">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>College Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
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

      <section className="admin-section">
        <h2>Product Management ({products.length})</h2>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Seller</th>
                <th>Actions</th>
              </tr>
            </thead>
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
      
      <section className="admin-section">
        <h2>User Management ({users.length})</h2>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>College</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
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