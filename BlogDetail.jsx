import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import CommentSection from '../../components/Comments/CommentSection';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/blogs/${id}`);
      
      if (response.data.success) {
        const blogData = response.data.data;
        setBlog(blogData);
        setIsLiked(blogData.isLiked || false);
        setLikesCount(blogData.likesCount || 0);
      }
    } catch (error) {
      console.error('Fetch blog error:', error);
      if (error.response?.status === 404) {
        toast.error('Blog post not found! 🔍');
        navigate('/');
      } else {
        toast.error('Failed to load blog post');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts! 🔑');
      return;
    }

    if (likeLoading) return;

    setLikeLoading(true);
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;

    // Optimistic update
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);

    try {
      const response = await axios.post(`/api/blogs/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setLikesCount(response.data.data.likesCount);
        setIsLiked(response.data.data.isLiked);
        toast.success(newIsLiked ? 'Post liked! ❤️' : 'Like removed! 🤍');
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
      toast.error('Failed to update like');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        toast.success('Blog post deleted successfully! 🗑️');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to delete blog post');
      console.error('Delete error:', error);
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

  const getReadingTime = () => {
    if (!blog?.content) return 0;
    const wordsPerMinute = 200;
    const wordCount = blog.content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="large" message="Loading blog post... 📖" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">😕</div>
          <h2>Blog post not found</h2>
          <p>The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn btn-primary">
            <span>🏠</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && blog.author && user._id === blog.author._id;

  return (
    <div className="blog-detail-page">
      <div className="container">
        {/* Blog Header */}
        <header className="blog-header">
          <div className="blog-breadcrumb">
            <Link to="/" className="breadcrumb-link">
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <span className="breadcrumb-separator">→</span>
            <span className="breadcrumb-current">Blog Post</span>
          </div>

          <div className="blog-category">
            <span className="category-emoji">{getCategoryEmoji(blog.category)}</span>
            <span className="category-name">{blog.category}</span>
          </div>

          <h1 className="blog-title">{blog.title}</h1>

          {blog.excerpt && (
            <p className="blog-excerpt">{blog.excerpt}</p>
          )}

          <div className="blog-meta">
            <div className="author-section">
              <div className="author-avatar">
                {blog.author?.avatar ? (
                  <img src={blog.author.avatar} alt={blog.author.name} />
                ) : (
                  <span className="avatar-placeholder">
                    {blog.author?.name?.charAt(0) || '👤'}
                  </span>
                )}
              </div>
              <div className="author-info">
                <div className="author-name">{blog.author?.name || 'Anonymous'}</div>
                <div className="blog-date">
                  <span>📅</span>
                  <time dateTime={blog.createdAt}>
                    {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                  </time>
                  <span>•</span>
                  <span>📖 {getReadingTime()} min read</span>
                </div>
              </div>
            </div>

            <div className="blog-stats">
              <span className="stat-item">
                <span className="stat-icon">👀</span>
                <span className="stat-count">{blog.views || 0} views</span>
              </span>
              <button 
                className={`stat-item like-btn ${isLiked ? 'liked' : ''} ${likeLoading ? 'loading' : ''}`}
                onClick={handleLike}
                disabled={likeLoading}
              >
                <span className="stat-icon">{isLiked ? '❤️' : '🤍'}</span>
                <span className="stat-count">{likesCount} likes</span>
              </button>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="owner-actions">
              <Link to={`/edit-blog/${blog._id}`} className="btn btn-secondary">
                <span>✏️</span>
                <span>Edit Post</span>
              </Link>
              <button onClick={handleDelete} className="btn btn-ghost delete-btn">
                <span>🗑️</span>
                <span>Delete Post</span>
              </button>
            </div>
          )}
        </header>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="featured-image">
            <img src={blog.featuredImage} alt={blog.title} />
          </div>
        )}

        {/* Blog Content */}
        <article className="blog-content">
          <div className="content-body">
            {blog.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') return null;
              return <p key={index}>{paragraph}</p>;
            })}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-tags">
              <h4>🏷️ Tags</h4>
              <div className="tags-list">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Engagement Section */}
        <div className="engagement-section">
          <div className="engagement-stats">
            <div className="stat-card">
              <div className="stat-icon">👀</div>
              <div className="stat-info">
                <span className="stat-number">{blog.views || 0}</span>
                <span className="stat-label">Views</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-info">
                <span className="stat-number">{likesCount}</span>
                <span className="stat-label">Likes</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-info">
                <span className="stat-number">{blog.commentsCount || 0}</span>
                <span className="stat-label">Comments</span>
              </div>
            </div>
          </div>

          <div className="engagement-actions">
            <button 
              className={`engagement-btn like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={likeLoading}
            >
              <span className="btn-icon">{isLiked ? '❤️' : '🤍'}</span>
              <span>{isLiked ? 'Liked' : 'Like this post'}</span>
            </button>
            
            <a href="#comments" className="engagement-btn">
              <span className="btn-icon">💬</span>
              <span>Add Comment</span>
            </a>
            
            <button 
              className="engagement-btn"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: blog.title,
                    text: blog.excerpt || blog.content.substring(0, 100),
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard! 📋');
                }
              }}
            >
              <span className="btn-icon">📤</span>
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <section id="comments" className="comments-section">
          <CommentSection blogId={blog._id} />
        </section>

        {/* Back to Blogs */}
        <div className="back-to-blogs">
          <Link to="/" className="btn btn-ghost">
            <span>←</span>
            <span>Back to All Posts</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;

