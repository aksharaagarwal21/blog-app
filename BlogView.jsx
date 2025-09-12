import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import './BlogView.css';

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Use useCallback to prevent infinite re-renders
  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔧 Fetching blog:', id);
      
      const response = await axios.get(`${API_BASE_URL}/blogs/${id}`, {
        headers: isAuthenticated ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        } : {}
      });

      console.log('✅ Blog response:', response.data);

      if (response.data.success) {
        setBlog(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to load blog');
      }
    } catch (error) {
      console.error('❌ Fetch blog error:', error);
      
      if (error.response?.status === 404) {
        toast.error('Blog post not found');
        navigate('/');
      } else if (error.response?.status === 401) {
        toast.error('Please login to view this blog');
        navigate('/login');
      } else {
        toast.error('Failed to load blog post');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, API_BASE_URL, navigate]);

  useEffect(() => {
    if (id) {
      fetchBlog();
    } else {
      navigate('/');
    }
  }, [id, fetchBlog, navigate]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts! 🔑');
      navigate('/login');
      return;
    }

    if (liking) return;

    try {
      setLiking(true);
      console.log('🔧 Toggling like for blog:', id);
      
      const response = await axios.post(`${API_BASE_URL}/blogs/${id}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Like response:', response.data);

      if (response.data.success) {
        setBlog(prev => ({
          ...prev,
          isLiked: response.data.isLiked,
          likesCount: response.data.likesCount
        }));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('❌ Like error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to like post';
      toast.error(errorMessage);
    } finally {
      setLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to comment! 🔑');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (newComment.trim().length > 1000) {
      toast.error('Comment cannot exceed 1000 characters');
      return;
    }

    if (commenting) return;

    try {
      setCommenting(true);
      console.log('🔧 Adding comment:', { content: newComment.trim() });
      
      const response = await axios.post(`${API_BASE_URL}/blogs/${id}/comment`, {
        content: newComment.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Comment response:', response.data);

      if (response.data.success) {
        // Refresh the entire blog to get updated comments with populated author data
        await fetchBlog();
        setNewComment('');
        toast.success('Comment added successfully! 💬');
      }
    } catch (error) {
      console.error('❌ Comment error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add comment';
      toast.error(errorMessage);
    } finally {
      setCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      console.log('🔧 Deleting blog:', id);
      
      const response = await axios.delete(`${API_BASE_URL}/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('✅ Delete response:', response.data);

      if (response.data.success) {
        toast.success('Blog deleted successfully! 🗑️');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete blog post';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(dateString);
  };

  const handleShare = async () => {
    const shareData = {
      title: blog.title,
      text: blog.excerpt || 'Check out this blog post!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully! 📤');
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard! 📋');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="large" message="Loading blog post..." />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>📄 Blog post not found</h2>
          <p>The blog post you're looking for doesn't exist or has been removed.</p>
          <div className="error-actions">
            <Link to="/" className="btn btn-primary">
              🏠 Go to Home
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              📊 Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-view-page">
      <div className="container">
        {/* Blog Header */}
        <div className="blog-header">
          <div className="blog-meta">
            <span className="blog-category">
              {getCategoryEmoji(blog.category)} {blog.category}
            </span>
            <span className="blog-date">📅 {formatDate(blog.createdAt)}</span>
            <span className="reading-time">⏱️ {blog.readingTime || 1} min read</span>
            {blog.isAuthor && (
              <span className="author-badge">👑 Your Post</span>
            )}
          </div>

          <h1 className="blog-title">{blog.title}</h1>

          <div className="blog-author">
            <div className="author-info">
              {blog.author?.avatar ? (
                <img src={blog.author.avatar} alt={blog.author.name} className="author-avatar" />
              ) : (
                <div className="author-avatar-placeholder">
                  {blog.author?.name?.charAt(0) || '👤'}
                </div>
              )}
              <div className="author-details">
                <h4>{blog.author?.name}</h4>
                <p>{blog.author?.bio || 'Blogger'}</p>
                <small>Published {getTimeAgo(blog.createdAt)}</small>
              </div>
            </div>

            <div className="blog-stats">
              <span>👀 {blog.views} views</span>
              <span>❤️ {blog.likesCount} likes</span>
              <span>💬 {blog.commentsCount} comments</span>
            </div>
          </div>

          {/* Action Buttons */}
          {blog.isAuthor && (
            <div className="blog-actions">
              <Link 
                to={`/edit-blog/${blog._id}`} 
                className="btn btn-secondary"
              >
                ✏️ Edit Post
              </Link>
              <button 
                onClick={handleDelete} 
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? '🔄 Deleting...' : '🗑️ Delete Post'}
              </button>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="blog-featured-image">
            <img 
              src={blog.featuredImage} 
              alt={blog.title}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="blog-content">
          {blog.excerpt && (
            <div className="blog-excerpt">
              <em>{blog.excerpt}</em>
            </div>
          )}

          <div className="blog-body">
            {blog.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-tags">
              <h4>🏷️ Tags:</h4>
              <div className="tags-list">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Like and Share Buttons */}
        <div className="blog-interactions">
          <button 
            onClick={handleLike}
            disabled={liking || !isAuthenticated}
            className={`like-button ${blog.isLiked ? 'liked' : ''} ${!isAuthenticated ? 'disabled' : ''}`}
            title={!isAuthenticated ? 'Login to like this post' : ''}
          >
            <span className="like-icon">
              {liking ? '🔄' : blog.isLiked ? '❤️' : '🤍'}
            </span>
            <span className="like-text">
              {blog.likesCount} {blog.likesCount === 1 ? 'Like' : 'Likes'}
            </span>
          </button>

          <div className="share-buttons">
            <button onClick={handleShare} className="btn btn-ghost">
              📤 Share
            </button>
            {!isAuthenticated && (
              <Link to="/login" className="btn btn-ghost">
                🔑 Login to Like
              </Link>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>💬 Comments ({blog.commentsCount})</h3>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <div className="comment-input-group">
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user?.name?.charAt(0) || '👤'}
                    </div>
                  )}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows="3"
                  disabled={commenting}
                  maxLength={1000}
                />
              </div>
              <div className="comment-form-footer">
                <div className="character-count">
                  {newComment.length}/1000 characters
                </div>
                <button 
                  type="submit" 
                  disabled={commenting || !newComment.trim()}
                  className="btn btn-primary"
                >
                  {commenting ? '🔄 Adding...' : '💬 Add Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="login-prompt">
              <p>Please <Link to="/login">login</Link> to leave a comment.</p>
            </div>
          )}

          {/* Comments List */}
          <div className="comments-list">
            {blog.comments && blog.comments.length > 0 ? (
              [...blog.comments]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((comment) => (
                  <div key={comment._id || comment.createdAt} className="comment-item">
                    <div className="comment-avatar">
                      {comment.author?.avatar ? (
                        <img src={comment.author.avatar} alt={comment.author.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {comment.author?.name?.charAt(0) || '👤'}
                        </div>
                      )}
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <strong>{comment.author?.name || 'Anonymous'}</strong>
                        <span className="comment-date">
                          {getTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="no-comments">
                <div className="no-comments-icon">💬</div>
                <h4>No comments yet</h4>
                <p>Be the first to share your thoughts! 🎉</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="blog-navigation">
          <Link to="/" className="btn btn-secondary">
            ↩️ Back to Home
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="btn btn-ghost">
              📊 Dashboard
            </Link>
          )}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn btn-ghost">
            ⬆️ Back to Top
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogView;

