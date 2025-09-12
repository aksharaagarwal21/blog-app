import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    featuredImage: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const categories = [
    'Technology', 'Lifestyle', 'Travel', 'Food', 
    'Business', 'Health', 'Education', 'Entertainment', 'Other'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBlog();
  }, [id, isAuthenticated, navigate]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        const blog = response.data.data;
        
        // Check if user owns this blog
        if (!blog.isAuthor) {
          toast.error('You can only edit your own blog posts!');
          navigate('/dashboard');
          return;
        }

        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          category: blog.category || '',
          tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
          featuredImage: blog.featuredImage || '',
          status: blog.status || 'draft'
        });
      }
    } catch (error) {
      console.error('Fetch blog error:', error);
      toast.error('Failed to load blog post');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e, submitStatus = null) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form!');
      return;
    }

    setSaving(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const currentStatus = submitStatus || formData.status;

      const blogData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        category: formData.category,
        tags: tagsArray,
        featuredImage: formData.featuredImage.trim(),
        status: currentStatus
      };

      const response = await axios.put(`${API_BASE_URL}/blogs/${id}`, blogData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        const message = currentStatus === 'published' 
          ? 'Blog updated and published successfully! 🎉' 
          : 'Blog updated successfully! ✏️';
        
        toast.success(message);
        navigate(`/blog/${id}`);
      }
    } catch (error) {
      console.error('Update blog error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update blog post';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="large" message="Loading blog post..." />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0', background: 'var(--bg-primary)' }}>
      <div className="container">
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-2xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-light)',
          border: '1px solid var(--border-color)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              ✏️ Edit Blog Post
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
              Update your blog post content
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Title */}
            <div className="form-group">
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                <span>📝</span> Blog Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Enter an engaging title..."
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: `2px solid ${errors.title ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
              />
              {errors.title && (
                <div style={{ 
                  color: '#dc2626', 
                  fontSize: '0.875rem', 
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  ❌ {errors.title}
                </div>
              )}
            </div>

            {/* Category and Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  <span>🏷️</span> Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`form-select ${errors.category ? 'error' : ''}`}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: `2px solid ${errors.category ? '#ef4444' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '1rem',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Select a category...</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    ❌ {errors.category}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  <span>📊</span> Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '1rem',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="draft">📝 Draft</option>
                  <option value="published">✅ Published</option>
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="form-group">
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                <span>✍️</span> Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className={`form-textarea ${errors.content ? 'error' : ''}`}
                placeholder="Write your amazing blog content here..."
                rows="15"
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: `2px solid ${errors.content ? '#ef4444' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '1rem',
                  lineHeight: '1.7',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
              />
              {errors.content && (
                <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  ❌ {errors.content}
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="form-group">
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                <span>📄</span> Excerpt (Optional)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief summary of your post..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Tags and Featured Image */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  <span>🏷️</span> Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="react, javascript, programming (comma separated)"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '1rem',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  <span>🖼️</span> Featured Image URL
                </label>
                <input
                  type="url"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '1rem',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              marginTop: '2rem' 
            }}>
              <button
                type="button"
                onClick={() => navigate(`/blog/${id}`)}
                style={{
                  padding: '1rem 2rem',
                  background: 'var(--gray-100)',
                  color: 'var(--gray-700)',
                  border: '2px solid var(--gray-300)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>↩️</span>
                <span>Cancel</span>
              </button>
              
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={saving}
                style={{
                  padding: '1rem 2rem',
                  background: saving ? 'var(--gray-400)' : 'var(--secondary-500)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {saving ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Save Draft</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'published')}
                disabled={saving}
                style={{
                  padding: '1rem 2rem',
                  background: saving ? 'var(--gray-400)' : 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {saving ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Update & Publish</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;

