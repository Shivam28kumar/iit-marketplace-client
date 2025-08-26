// src/pages/ProductDetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuthContext } from '../context/AuthContext';
import { useConversation } from '../context/ConversationContext';
import toast from 'react-hot-toast';
import { FaShareAlt } from 'react-icons/fa';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  // --- HOOKS ---
  const { id } = useParams();
  const { user } = useAuthContext();
  const { setSelectedConversation } = useConversation();
  const navigate = useNavigate();

  // --- STATE ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATA FETCHING ---
  // This useEffect fetches the complete product details when the page loads.
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Product could not be found.');
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- EVENT HANDLER for the "Contact Seller" button ---
  const handleContactSeller = async () => {
    // 1. Initial Checks
    if (!user) {
      toast.error("Please log in to contact the seller.");
      navigate('/login');
      return;
    }
    if (!product || !product.user) {
      return toast.error("Cannot determine seller's details.");
    }
    if (product.user._id === user.id) {
      toast.error("You cannot contact yourself.");
      return;
    }
    // 2. Business Rules Check
    if (product.productType === 'peer-to-peer') {
      if (!product.user.college?._id || !user.college?.id) {
          return toast.error("Cannot verify college details for this transaction.");
      }
      if (product.user.college._id !== user.college.id) {
        toast.error("You can only contact sellers from your own college for this item.");
        return;
      }
    }

    // 3. Initiate Conversation
    try {
      // --- THIS IS THE FIX ---
      // We now call the 'send' endpoint WITHOUT a message body.
      // The backend will find or create the conversation and do nothing else.
      // This prevents the duplicate "Hi, I'm interested..." message.
      await api.post(`/chat/send/${product.user._id}`, {
        productId: product._id, // We only need to send the productId
      });

      // The rest of the logic to find the conversation and navigate is correct.
      const { data: allConversations } = await api.get("/chat/conversations");
      const conversationWithSeller = allConversations.find(
        (convo) => convo.participants[0]?._id === product.user._id && convo.product?._id === product._id
      );
      if (conversationWithSeller) {
        setSelectedConversation(conversationWithSeller);
      }
      navigate('/chat');
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not start conversation.");
    }
  };

  // --- EVENT HANDLER for the "Share" button ---
  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out this ${product.title} on IIT Marketplace!`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Could not copy link.');
      }
    }
  };

  // --- RENDER LOGIC ---
  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found.</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-image-wrapper">
        {/* You had an extra empty div here, which I have removed for cleaner code */}
        <img src={product.imageUrl} alt={product.title} className="product-detail-image"/>
      </div>
      <div className="product-detail-info-wrapper">
        <div className="product-title-wrapper">
          <h1 className="product-detail-title">{product.title}</h1>
          <button onClick={handleShare} className="share-button" title="Share this product">
            <FaShareAlt />
          </button>
          {product.productType === 'assured' && (
            <div className="assured-badge-detail">
              <span>ASSURED</span>
            </div>
          )}
        </div>
        <p className="product-detail-price">₹{product.price}</p>
        <div className="product-detail-section">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>
        <div className="product-detail-section">
          <h3>Seller Information</h3>
          {product.user ? (
            <p>Sold by: <Link to={`/profile/${product.user._id}`}><strong> {product.user.fullName}</strong></Link></p>
          ) : (
            <p>Sold by: An anonymous user</p>
          )}
        </div>
        <button onClick={handleContactSeller} className="contact-seller-button">Contact Seller</button>
      </div>
    </div>
  );
};

export default ProductDetailPage;