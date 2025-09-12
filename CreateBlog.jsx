import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './CreateBlog.css';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    featuredImage: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // API Base URL - using absolute URL to fix the issue
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const categories = [
    'Technology', 'Lifestyle', 'Travel', 'Food', 
    'Business', 'Health', 'Education', 'Entertainment', 'Other'
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to create a blog post! 🔑');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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

    if (name === 'content') {
      const words = value.trim().split(/\s+/).length;
      setWordCount(value.trim() === '' ? 0 : words);
    }
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      tags: value
    }));
  };

  const handleSubmit = async (e, submitStatus = null) => {
    e.preventDefault();
    
    console.log('🔧 Form submission started');
    console.log('🔧 Current form data:', formData);
    console.log('🔧 Submit status:', submitStatus || formData.status);

    if (!isAuthenticated) {
      toast.error('Please login to create a blog post! 🔑');
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form! 📝');
      return;
    }

    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const currentStatus = submitStatus || formData.status;

      const blogData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 200) + '...',
        category: formData.category,
        tags: tagsArray,
        featuredImage: formData.featuredImage.trim(),
        status: currentStatus
      };

      console.log('🔧 Sending blog data:', blogData);
      console.log('🔧 API URL:', `${API_BASE_URL}/blogs`);

      const token = localStorage.getItem('token');
      console.log('🔧 Token exists:', !!token);

      const response = await axios.post(`${API_BASE_URL}/blogs`, blogData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Blog creation response:', response.data);

      if (response.data.success) {
        const message = currentStatus === 'published' 
          ? 'Blog published successfully! 🎉' 
          : 'Blog saved as draft! 💾';
        
        toast.success(message);
        navigate('/dashboard');
      } else {
        throw new Error(response.data.message || 'Failed to create blog');
      }
    } catch (error) {
      console.error('❌ Blog creation error:', error);
      console.error('❌ Error response:', error.response);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create blog post';
      toast.error(errorMessage);

      // Handle specific validation errors
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.field] = err.message;
        });
        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = (e) => {
    handleSubmit(e, 'draft');
  };

  // Handle publish
  const handlePublish = (e) => {
    handleSubmit(e, 'published');
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Technology': '💻',
      'Lifestyle': '🌟',
      'Travel': '✈️',
      'Food': '🍕',
      'Business': '💼',
      'Health': '🏥',
      'Education': '📚',
      'Entertainment': '🎬',
      'Other': '📝'
    };
    return emojis[category] || '📝';
  };

  const getReadingTime = () => {
    return Math.ceil(wordCount / 200) || 1;
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="create-blog-page">
      <div className="container">
        {/* Header */}
        <div className="create-blog-header">
          <div className="header-content">
            <h1>✍️ Create New Blog Post</h1>
            <p>Share your thoughts and stories with the world</p>
          </div>
          <div className="header-actions">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="btn btn-secondary"
            >
              <span>{previewMode ? '✏️' : '👁️'}</span>
              <span>{previewMode ? 'Edit' : 'Preview'}</span>
            </button>
          </div>
        </div>

        {previewMode ? (
          /* Preview Mode */
          <div className="blog-preview">
            <div className="preview-card">
              <div className="preview-header">
                <h2>📖 Preview</h2>
                <div className="preview-stats">
                  <span>📊 {wordCount} words</span>
                  <span>⏱️ {getReadingTime()} min read</span>
                </div>
              </div>
              
              <div className="preview-content">
                {formData.featuredImage && (
                  <div className="preview-image">
                    <img src={formData.featuredImage} alt="Featured" />
                  </div>
                )}
                
                <div className="preview-meta">
                  {formData.category && (
                    <span className="preview-category">
                      {getCategoryEmoji(formData.category)} {formData.category}
                    </span>
                  )}
                  <span className="preview-author">By {user?.name}</span>
                </div>

                <h1 className="preview-title">
                  {formData.title || 'Untitled Blog Post'}
                </h1>

                {formData.excerpt && (
                  <p className="preview-excerpt">{formData.excerpt}</p>
                )}

                <div className="preview-body">
                  {formData.content ? (
                    formData.content.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <p className="preview-placeholder">Start writing to see your content here...</p>
                  )}
                </div>

                {formData.tags && (
                  <div className="preview-tags">
                    {formData.tags.split(',').map((tag, index) => (
                      <span key={index} className="preview-tag">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="create-blog-form">
            <div className="form-grid">
              {/* Left Column - Main Content */}
              <div className="main-content">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    <span className="label-icon">📝</span>
                    <span>Blog Title</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`form-input title-input ${errors.title ? 'error' : ''}`}
                    placeholder="Enter an engaging title for your blog post..."
                    required
                    maxLength="100"
                  />
                  <div className="character-count">
                    {formData.title.length}/100 characters
                  </div>
                  {errors.title && (
                    <div className="form-error">❌ {errors.title}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="excerpt" className="form-label">
                    <span className="label-icon">📄</span>
                    <span>Excerpt (Optional)</span>
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Write a brief summary of your blog post..."
                    rows="3"
                    maxLength="200"
                  />
                  <div className="character-count">
                    {formData.excerpt.length}/200 characters
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="content" className="form-label">
                    <span className="label-icon">✍️</span>
                    <span>Content</span>
                    <span className="required">*</span>
                  </label>
                  <div className="content-stats">
                    <span>📊 {wordCount} words</span>
                    <span>⏱️ {getReadingTime()} min read</span>
                  </div>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className={`form-textarea content-textarea ${errors.content ? 'error' : ''}`}
                    placeholder="Start writing your amazing blog post here...

You can write multiple paragraphs, share your thoughts, experiences, and insights.

Tips for great content:
• Be authentic and genuine
• Tell a story that resonates
• Use examples and personal experiences
• Break up text with paragraphs
• End with a strong conclusion"
                    required
                    rows="20"
                  />
                  {errors.content && (
                    <div className="form-error">❌ {errors.content}</div>
                  )}
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="sidebar-content">
                <div className="sidebar-card">
                  <h3>🎨 Blog Settings</h3>
                  
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">
                      <span className="label-icon">🏷️</span>
                      <span>Category</span>
                      <span className="required">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`form-select ${errors.category ? 'error' : ''}`}
                      required
                    >
                      <option value="">Select a category...</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {getCategoryEmoji(category)} {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <div className="form-error">❌ {errors.category}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="tags" className="form-label">
                      <span className="label-icon">🏷️</span>
                      <span>Tags</span>
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleTagsChange}
                      className="form-input"
                      placeholder="react, javascript, programming"
                    />
                    <div className="form-help">
                      Separate tags with commas
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="featuredImage" className="form-label">
                      <span className="label-icon">🖼️</span>
                      <span>Featured Image URL</span>
                    </label>
                    <input
                      type="url"
                      id="featuredImage"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.featuredImage && (
                      <div className="image-preview">
                        <img 
                          src={formData.featuredImage} 
                          alt="Featured preview"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="image-error" style={{ display: 'none' }}>
                          ❌ Invalid image URL
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="status" className="form-label">
                      <span className="label-icon">📊</span>
                      <span>Status</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="draft">📝 Draft</option>
                      <option value="published">✅ Published</option>
                    </select>
                  </div>
                </div>

                <div className="sidebar-card">
                  <h3>💡 Writing Tips</h3>
                  <div className="tips-list">
                    <div className="tip-item">
                      <span className="tip-icon">🎯</span>
                      <span>Keep your title clear and engaging</span>
                    </div>
                    <div className="tip-item">
                      <span className="tip-icon">📖</span>
                      <span>Write in a conversational tone</span>
                    </div>
                    <div className="tip-item">
                      <span className="tip-icon">✨</span>
                      <span>Use examples and personal stories</span>
                    </div>
                    <div className="tip-item">
                      <span className="tip-icon">🔍</span>
                      <span>Proofread before publishing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-ghost"
                disabled={loading}
              >
                <span>↩️</span>
                <span>Cancel</span>
              </button>
              
              <div className="action-group">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading && formData.status === 'draft' ? (
                    <>
                      <div className="loading-spinner"></div>
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
                  onClick={handlePublish}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading && formData.status === 'published' ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Publish</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;



