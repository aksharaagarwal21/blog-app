import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

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
      await login(formData);
      toast.success('Welcome back! 🎉');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {/* Header */}
            <div className="auth-header">
              <div className="auth-icon">🔑</div>
              <h1>Welcome Back!</h1>
              <p>Sign in to continue your blogging journey</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
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
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span className="label-icon">🔒</span>
                  <span>Password</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn btn-secondary social-btn google-btn"
              disabled={loading}
            >
              <span className="social-icon">🌈</span>
              <span>Continue with Google</span>
            </button>

            {/* Sign Up Link */}
            <div className="auth-footer">
              <p>
                New to BlogSpace? 
                <Link to="/register" className="auth-link">
                  Create Account ✨
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="auth-illustration">
          <div className="illustration-content">
            <div className="illustration-icon">✨</div>
            <h2>Join Our Community</h2>
            <p>Connect with writers, share your stories, and discover amazing content from around the world.</p>
            
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">📝</span>
                <span>Write & Share Stories</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Connect with Writers</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Track Your Progress</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌟</span>
                <span>Get Inspired Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


