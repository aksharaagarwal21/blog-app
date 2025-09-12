import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar container">
        <Link to="/" className="logo" onClick={handleNavClick}>
          <div className="logo-content">
            <span className="logo-icon">✨</span>
            <span className="logo-text">BlogSpace</span>
          </div>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={isMenuOpen ? 'active' : ''}></span>
          <span className={isMenuOpen ? 'active' : ''}></span>
          <span className={isMenuOpen ? 'active' : ''}></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>
          
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="nav-icon">💫</span>
            <span>About</span>
          </Link>

          <Link 
            to="/contact" 
            className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="nav-icon">📧</span>
            <span>Contact</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard"
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <span className="nav-icon">📊</span>
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/create-blog"
                className={`nav-link ${location.pathname === '/create-blog' ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <span className="nav-icon">✍️</span>
                <span>Write</span>
              </Link>
              
              <div className="user-menu">
                <div className="user-info">
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span className="avatar-placeholder">
                        {user?.name?.charAt(0) || '👤'}
                      </span>
                    )}
                  </div>
                  <span className="user-greeting">
                    Hi, {user?.name?.split(' ')[0] || 'User'} 👋
                  </span>
                </div>
                
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={handleNavClick}>
                    <span>👤</span>
                    <span>Profile</span>
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <span className="nav-icon">🔑</span>
                <span>Login</span>
              </Link>
              <Link 
                to="/register"
                className={`btn btn-primary ${location.pathname === '/register' ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                <span>🚀</span>
                <span>Join Us</span>
              </Link>
            </>
          )}
          
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          >
            <span className="theme-icon">
              {isDark ? '☀️' : '🌙'}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;


