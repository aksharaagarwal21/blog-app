import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
    fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/users/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        updateUser(response.data.data);
        toast.success('Profile updated successfully! ✨');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>👤 My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="profile-content">
          {/* Profile Stats */}
          <div className="profile-stats">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <h3>{stats.totalBlogs}</h3>
                  <p>Blog Posts</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👀</div>
                <div className="stat-content">
                  <h3>{stats.totalViews}</h3>
                  <p>Total Views</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-content">
                  <h3>{stats.totalLikes}</h3>
                  <p>Total Likes</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <h3>{stats.totalComments}</h3>
                  <p>Comments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="profile-form-section">
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-header">
                <h3>✏️ Edit Profile Information</h3>
              </div>

              <div className="avatar-section">
                <div className="current-avatar">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Profile" />
                  ) : (
                    <span className="avatar-placeholder">
                      {formData.name?.charAt(0) || '👤'}
                    </span>
                  )}
                </div>
                <div className="avatar-info">
                  <h4>Profile Picture</h4>
                  <p>Add a photo URL to personalize your profile</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <span className="label-icon">👤</span>
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="label-icon">📧</span>
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                  disabled // Email usually shouldn't be editable
                />
                <small className="form-help">
                  Contact support to change your email address
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="avatar" className="form-label">
                  <span className="label-icon">🖼️</span>
                  <span>Avatar URL</span>
                </label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://example.com/avatar.jpg"
                />
                <small className="form-help">
                  Enter a URL for your profile picture
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="bio" className="form-label">
                  <span className="label-icon">📝</span>
                  <span>Bio</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Tell us about yourself..."
                  rows="5"
                  maxLength="500"
                />
                <div className="character-count">
                  {formData.bio.length}/500 characters
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Update Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
