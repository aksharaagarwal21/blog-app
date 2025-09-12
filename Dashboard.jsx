import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [analytics, setAnalytics] = useState({
    overview: {
      totalBlogs: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0
    },
    recentBlogs: [],
    popularBlogs: [],
    recentComments: [],
    categoryStats: []
  });
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // API Base URL - Fixed to use absolute URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Use useCallback to prevent infinite re-renders
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔧 Fetching dashboard data...');
      console.log('🔧 API Base URL:', API_BASE_URL);
      console.log('🔧 Token exists:', !!token);

      // Always fetch user blogs first (this is the main issue fix)
      const blogsResponse = await axios.get(`${API_BASE_URL}/blogs/my-blogs`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ My blogs response:', blogsResponse.data);

      if (blogsResponse.data.success) {
        const blogs = blogsResponse.data.data || [];
        setUserBlogs(blogs);

        // Calculate analytics from blogs data
        const totalBlogs = blogs.length;
        const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
        const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likesCount || 0), 0);
        const totalComments = blogs.reduce((sum, blog) => sum + (blog.commentsCount || 0), 0);

        // Calculate category stats
        const categoryStats = blogs.reduce((acc, blog) => {
          const category = blog.category || 'Other';
          const existing = acc.find(item => item._id === category);
          if (existing) {
            existing.count += 1;
            existing.totalViews += blog.views || 0;
            existing.totalLikes += blog.likesCount || 0;
          } else {
            acc.push({
              _id: category,
              count: 1,
              totalViews: blog.views || 0,
              totalLikes: blog.likesCount || 0
            });
          }
          return acc;
        }, []);

        // Sort blogs by different criteria
        const recentBlogs = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        const popularBlogs = [...blogs].filter(blog => blog.status === 'published').sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

        setAnalytics({
          overview: {
            totalBlogs,
            totalViews,
            totalLikes,
            totalComments
          },
          recentBlogs,
          popularBlogs,
          recentComments: [], // We'll implement this later if needed
          categoryStats: categoryStats.sort((a, b) => b.count - a.count)
        });

        console.log('✅ Analytics calculated:', {
          totalBlogs,
          totalViews,
          totalLikes,
          totalComments,
          categoriesCount: categoryStats.length
        });
      }

      // Try to fetch dashboard analytics from backend (optional)
      try {
        const analyticsResponse = await axios.get(`${API_BASE_URL}/dashboard/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (analyticsResponse.data.success) {
          console.log('✅ Backend analytics:', analyticsResponse.data.data);
          // You can merge backend analytics with calculated analytics if needed
        }
      } catch (analyticsError) {
        console.log('⚠️ Backend analytics not available, using calculated analytics');
        // This is fine, we'll use our calculated analytics
      }

    } catch (error) {
      console.error('❌ Dashboard fetch error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again! 🔑');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error('Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, navigate]); // Dependencies for useCallback

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, navigate, fetchDashboardData]);

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🔧 Deleting blog:', blogId);
      
      const response = await axios.delete(`${API_BASE_URL}/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        toast.success('Blog post deleted successfully! 🗑️');
        setUserBlogs(prev => prev.filter(blog => blog._id !== blogId));
        fetchDashboardData(); // Refresh analytics
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const handleBlogCardClick = (blogId) => {
    navigate(`/blog/${blogId}`);
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

  const getCategoryColor = (index) => {
    const colors = [
      'var(--primary-400)',
      'var(--secondary-400)',
      'var(--accent-400)',
      'var(--purple-400)',
      'var(--peach-400)'
    ];
    return colors[index % colors.length];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="large" message="Loading your dashboard... ✨" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Welcome Header */}
        <section className="dashboard-welcome">
          <div className="welcome-content">
            <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p>Here's what's happening with your blog today</p>
          </div>
          <div className="welcome-actions">
            <Link to="/create-blog" className="btn btn-primary">
              <span>✍️</span>
              <span>Write New Post</span>
            </Link>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>{analytics.overview.totalBlogs}</h3>
              <p>Total Posts</p>
            </div>
            <div className="stat-trend">
              <span className="trend-up">📈</span>
            </div>
          </div>

          <div className="stat-card secondary">
            <div className="stat-icon">👀</div>
            <div className="stat-content">
              <h3>{analytics.overview.totalViews}</h3>
              <p>Total Views</p>
            </div>
            <div className="stat-trend">
              <span className="trend-up">📈</span>
            </div>
          </div>

          <div className="stat-card accent">
            <div className="stat-icon">❤️</div>
            <div className="stat-content">
              <h3>{analytics.overview.totalLikes}</h3>
              <p>Total Likes</p>
            </div>
            <div className="stat-trend">
              <span className="trend-up">📈</span>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <h3>{analytics.overview.totalComments}</h3>
              <p>Comments</p>
            </div>
            <div className="stat-trend">
              <span className="trend-up">📈</span>
            </div>
          </div>
        </section>

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'my-blogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-blogs')}
          >
            📚 My Blogs ({userBlogs.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="dashboard-grid">
              {/* Recent Posts */}
              <section className="dashboard-card recent-posts">
                <div className="card-header">
                  <h3>📚 Recent Posts</h3>
                  <Link to="/create-blog" className="btn btn-ghost btn-sm">
                    <span>+</span>
                    <span>New Post</span>
                  </Link>
                </div>
                <div className="card-content">
                  {analytics.recentBlogs?.length > 0 ? (
                    <div className="posts-list">
                      {analytics.recentBlogs.slice(0, 5).map((blog) => (
                        <div 
                          key={blog._id} 
                          className="post-item clickable"
                          onClick={() => handleBlogCardClick(blog._id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="post-info">
                            <h4>{blog.title}</h4>
                            <div className="post-meta">
                              <span className="post-date">
                                📅 {formatDate(blog.createdAt)}
                              </span>
                              <span className={`post-status ${blog.status}`}>
                                {blog.status === 'published' ? '✅' : '📝'} 
                                {blog.status}
                              </span>
                            </div>
                          </div>
                          <div className="post-stats">
                            <span>👀 {blog.views || 0}</span>
                            <span>❤️ {blog.likesCount || 0}</span>
                            <span>💬 {blog.commentsCount || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📝</div>
                      <h4>No posts yet</h4>
                      <p>Create your first blog post to get started!</p>
                      <Link to="/create-blog" className="btn btn-primary btn-sm">
                        <span>✍️</span>
                        <span>Write First Post</span>
                      </Link>
                    </div>
                  )}
                </div>
              </section>

              {/* Quick Stats */}
              <section className="dashboard-card quick-stats">
                <div className="card-header">
                  <h3>⚡ Quick Stats</h3>
                  <span className="card-subtitle">Your blog performance</span>
                </div>
                <div className="card-content">
                  <div className="quick-stats-grid">
                    <div className="quick-stat-item">
                      <div className="stat-number">{userBlogs.filter(blog => blog.status === 'published').length}</div>
                      <div className="stat-label">Published</div>
                    </div>
                    <div className="quick-stat-item">
                      <div className="stat-number">{userBlogs.filter(blog => blog.status === 'draft').length}</div>
                      <div className="stat-label">Drafts</div>
                    </div>
                    <div className="quick-stat-item">
                      <div className="stat-number">{analytics.categoryStats.length}</div>
                      <div className="stat-label">Categories</div>
                    </div>
                    <div className="quick-stat-item">
                      <div className="stat-number">
                        {userBlogs.length > 0 ? Math.round(analytics.overview.totalViews / userBlogs.length) : 0}
                      </div>
                      <div className="stat-label">Avg Views</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'my-blogs' && (
            <div className="my-blogs-section">
              {userBlogs.length > 0 ? (
                <div className="blogs-grid">
                  {userBlogs.map(blog => (
                    <div 
                      key={blog._id} 
                      className="blog-card clickable"
                      onClick={() => handleBlogCardClick(blog._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="blog-header">
                        <div className="blog-meta">
                          <span className="blog-category">
                            {getCategoryEmoji(blog.category)} {blog.category}
                          </span>
                          <span className={`blog-status ${blog.status}`}>
                            {blog.status === 'published' ? '✅' : '📝'} {blog.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="blog-content">
                        <h3 className="blog-title">{blog.title}</h3>
                        <p className="blog-excerpt">
                          {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                        </p>
                        
                        <div className="blog-stats">
                          <span>👀 {blog.views || 0}</span>
                          <span>❤️ {blog.likesCount || 0}</span>
                          <span>💬 {blog.commentsCount || 0}</span>
                          <span>📅 {formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="blog-actions" onClick={(e) => e.stopPropagation()}>
                        <Link 
                          to={`/edit-blog/${blog._id}`}
                          className="btn btn-sm btn-secondary"
                        >
                          ✏️ Edit
                        </Link>
                        <Link 
                          to={`/blog/${blog._id}`}
                          className="btn btn-sm btn-ghost"
                        >
                          👁️ View
                        </Link>
                        <button 
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="btn btn-sm btn-danger"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state large">
                  <div className="empty-icon">📝</div>
                  <h3>No blog posts yet</h3>
                  <p>Start sharing your thoughts and stories with the world!</p>
                  <Link to="/create-blog" className="btn btn-primary">
                    <span>✍️</span>
                    <span>Create Your First Post</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <div className="dashboard-grid">
                {/* Category Distribution */}
                <section className="dashboard-card category-stats">
                  <div className="card-header">
                    <h3>📊 Category Distribution</h3>
                  </div>
                  <div className="card-content">
                    {analytics.categoryStats?.length > 0 ? (
                      <div className="category-list">
                        {analytics.categoryStats.map((category, index) => (
                          <div key={category._id} className="category-item">
                            <div className="category-info">
                              <span className="category-name">
                                {getCategoryEmoji(category._id)} {category._id}
                              </span>
                              <span className="category-count">{category.count} posts</span>
                            </div>
                            <div className="category-bar">
                              <div 
                                className="category-progress" 
                                style={{
                                  width: `${(category.count / analytics.categoryStats[0]?.count) * 100}%`,
                                  background: getCategoryColor(index)
                                }}
                              />
                            </div>
                            <div className="category-stats">
                              <span>👀 {category.totalViews} views</span>
                              <span>❤️ {category.totalLikes} likes</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <h4>No categories yet</h4>
                        <p>Write posts in different categories to see distribution</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Popular Posts */}
                <section className="dashboard-card popular-posts">
                  <div className="card-header">
                    <h3>🔥 Popular Posts</h3>
                    <span className="card-subtitle">Most viewed posts</span>
                  </div>
                  <div className="card-content">
                    {analytics.popularBlogs?.length > 0 ? (
                      <div className="posts-list">
                        {analytics.popularBlogs.slice(0, 5).map((blog, index) => (
                          <div 
                            key={blog._id} 
                            className="post-item popular clickable"
                            onClick={() => handleBlogCardClick(blog._id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="popularity-rank">#{index + 1}</div>
                            <div className="post-info">
                              <h4>{blog.title}</h4>
                              <div className="post-meta">
                                <span>👀 {blog.views} views</span>
                                <span>❤️ {blog.likesCount} likes</span>
                                <span>📅 {formatDate(blog.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">📈</div>
                        <h4>No popular posts yet</h4>
                        <p>Keep writing to see your popular content!</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h3>⚡ Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/create-blog" className="action-card primary">
              <div className="action-icon">✍️</div>
              <div className="action-content">
                <h4>Write Post</h4>
                <p>Create a new blog post</p>
              </div>
            </Link>

            <Link to="/" className="action-card secondary">
              <div className="action-icon">🏠</div>
              <div className="action-content">
                <h4>View Blog</h4>
                <p>See your published posts</p>
              </div>
            </Link>

            <button className="action-card accent" onClick={fetchDashboardData}>
              <div className="action-icon">🔄</div>
              <div className="action-content">
                <h4>Refresh Stats</h4>
                <p>Update dashboard data</p>
              </div>
            </button>

            <Link to="/profile" className="action-card purple">
              <div className="action-icon">👤</div>
              <div className="action-content">
                <h4>Edit Profile</h4>
                <p>Update your information</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;










