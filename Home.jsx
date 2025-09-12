import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BlogCard from '../../components/Blog/BlogCard';
import SearchBar from '../../components/Common/SearchBar';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  const categories = [
    'all', 'Technology', 'Lifestyle', 'Travel', 'Food', 
    'Business', 'Health', 'Education', 'Entertainment', 'Other'
  ];

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      });

      const response = await axios.get(`/api/blogs?${params}`);
      
      if (response.data.success) {
        setBlogs(response.data.data.blogs || []);
      }
    } catch (error) {
      console.error('Fetch blogs error:', error);
      // Set empty array to prevent errors
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      'all': '🌟',
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

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        {/* Hero Section */}
        <section style={{
          textAlign: 'center',
          padding: '4rem 0',
          background: 'linear-gradient(135deg, var(--primary-50), var(--secondary-50))',
          borderRadius: 'var(--radius-2xl)',
          marginBottom: '3rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-600))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem'
          }}>
            Welcome to BlogSpace
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem'
          }}>
            Discover amazing stories, share your thoughts, and connect with passionate writers
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary">
              <span>🚀</span>
              <span>Start Writing</span>
            </Link>
            <Link to="#explore" className="btn btn-secondary">
              <span>🔍</span>
              <span>Explore Stories</span>
            </Link>
          </div>
        </section>

        {/* Search Section */}
        <section id="explore" style={{ marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍 Explore Content</h2>
          </div>
          
          {/* Categories */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: selectedCategory === category ? 'var(--primary-500)' : 'var(--bg-secondary)',
                  color: selectedCategory === category ? 'white' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{getCategoryEmoji(category)}</span>
                <span>{category === 'all' ? 'All Stories' : category}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Blogs Grid */}
        <section>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <LoadingSpinner />
              <p style={{ marginTop: '1rem' }}>Loading amazing stories... ✨</p>
            </div>
          ) : blogs.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {blogs.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3>No stories found</h3>
              <p style={{ marginBottom: '2rem' }}>Be the first to share your story!</p>
              <Link to="/create-blog" className="btn btn-primary">
                <span>✍️</span>
                <span>Write First Post</span>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;




