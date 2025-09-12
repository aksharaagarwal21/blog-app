import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'About', path: '/about', icon: '💫' },
    { name: 'Contact', path: '/contact', icon: '📧' },
    { name: 'Privacy', path: '/privacy', icon: '🔒' },
    { name: 'Terms', path: '/terms', icon: '📋' }
  ];

  const categories = [
    { name: 'Technology', icon: '💻' },
    { name: 'Lifestyle', icon: '🌟' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Food', icon: '🍕' },
    { name: 'Business', icon: '💼' }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com', color: '#1DA1F2' },
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com', color: '#4267B2' },
    { name: 'Instagram', icon: '📷', url: 'https://instagram.com', color: '#E4405F' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com', color: '#0077B5' },
    { name: 'GitHub', icon: '⚡', url: 'https://github.com', color: '#333' }
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          {/* Main Footer Content */}
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <span className="logo-icon">✨</span>
                <span className="logo-text">BlogSpace</span>
              </Link>
              <p className="footer-description">
                A beautiful platform where passionate writers share their stories, connect with readers, and build their audience. Join our growing community today! 🌟
              </p>
              
              {/* Social Links */}
              <div className="social-links">
                <h4>Connect with us 🤝</h4>
                <div className="social-icons">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      style={{ '--social-color': social.color }}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <span className="social-icon">{social.icon}</span>
                      <span className="social-name">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4>🔗 Quick Links</h4>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">
                      <span className="link-icon">{link.icon}</span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-section">
              <h4>📚 Popular Categories</h4>
              <ul className="footer-links">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link to={`/?category=${category.name.toLowerCase()}`} className="footer-link">
                      <span className="link-icon">{category.icon}</span>
                      <span>{category.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-section">
              <h4>📧 Stay Updated</h4>
              <p className="newsletter-description">
                Get the latest stories and updates delivered to your inbox weekly! ✨
              </p>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Your email address..."
                  className="newsletter-input"
                  aria-label="Email for newsletter subscription"
                />
                <button className="newsletter-btn" type="button">
                  <span>🚀</span>
                </button>
              </div>
              <p className="newsletter-note">
                💡 Join 10,000+ readers who never miss our updates
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="footer-stats">
            <div className="stat-item">
              <span className="stat-icon">📝</span>
              <div className="stat-content">
                <span className="stat-number">2,500+</span>
                <span className="stat-label">Stories Published</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">👥</span>
              <div className="stat-content">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Writers</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">❤️</span>
              <div className="stat-content">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Happy Readers</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🌍</span>
              <div className="stat-content">
                <span className="stat-number">100+</span>
                <span className="stat-label">Countries Reached</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} BlogSpace. Made with ❤️ for amazing writers and readers everywhere.
            </p>
            <div className="footer-bottom-links">
              <span className="footer-badge">✨ Built with passion</span>
              <span className="footer-badge">🚀 Powered by creativity</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
