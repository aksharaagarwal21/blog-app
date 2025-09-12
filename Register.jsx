import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[^a-zA-Z0-9]+/)) strength++;
    return strength;
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = '❌ Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = '❌ Name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          newErrors.name = '❌ Name cannot exceed 50 characters';
        } else {
          delete newErrors.name;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = '❌ Email address is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = '❌ Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = '❌ Password is required';
        } else if (value.length < 6) {
          newErrors.password = '❌ Password must be at least 6 characters';
        } else if (calculatePasswordStrength(value) < 3) {
          newErrors.password = '⚠️ Password is too weak. Use a mix of letters, numbers, and symbols';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = '❌ Please confirm your password';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = '❌ Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = () => {
    const fieldsToValidate = ['name', 'email', 'password', 'confirmPassword'];
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const fieldIsValid = validateField(field, formData[field]);
      if (!fieldIsValid) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Validate field on change
    validateField(name, value);

    // Also validate confirm password when password changes
    if (name === 'password' && formData.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateAllFields()) {
      toast.error('Please fix the errors below! 📝');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match! 😅');
      setErrors(prev => ({
        ...prev,
        confirmPassword: '❌ Passwords do not match'
      }));
      return;
    }

    if (passwordStrength < 3) {
      toast.error('Please choose a stronger password! 🔒');
      setErrors(prev => ({
        ...prev,
        password: '⚠️ Password is too weak. Use a mix of letters, numbers, and symbols'
      }));
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        bio: formData.bio.trim()
      });
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      toast.error(errorMessage);
      
      // Handle specific backend errors
      if (errorMessage.includes('email')) {
        setErrors(prev => ({
          ...prev,
          email: '❌ This email is already registered'
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    const googleURL = `${process.env.REACT_APP_API_URL}/auth/google`;
    console.log('🔧 Redirecting to Google OAuth:', googleURL);
    window.location.href = googleURL;
  };

  const getPasswordStrengthText = () => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const emojis = ['😰', '😕', '😐', '😊', '🔥'];
    return `${texts[passwordStrength]} ${emojis[passwordStrength]}`;
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
    return colors[passwordStrength];
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Illustration */}
        <div className="auth-illustration">
          <div className="illustration-content">
            <div className="illustration-icon">🚀</div>
            <h2>Start Your Journey</h2>
            <p>Join thousands of writers sharing their passion and building their audience on BlogSpace.</p>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">👥 Writers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">📚 Stories</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1M+</div>
                <div className="stat-label">👀 Readers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {/* Header */}
            <div className="auth-header">
              <div className="auth-icon">✨</div>
              <h1>Create Account</h1>
              <p>Join our community of passionate writers</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
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
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                />
                {errors.name && (
                  <div className="form-error">{errors.name}</div>
                )}
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
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="form-error">{errors.email}</div>
                )}
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
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Create a strong password"
                    required
                    autoComplete="new-password"
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
                {formData.password && (
                  <div className="password-strength">
                    <div 
                      className="strength-bar"
                      style={{ 
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    />
                    <span 
                      className="strength-text"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <div className="form-error">{errors.password}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <span className="label-icon">🔐</span>
                  <span>Confirm Password</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="form-error">{errors.confirmPassword}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="bio" className="form-label">
                  <span className="label-icon">📝</span>
                  <span>Bio (Optional)</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Tell us about yourself..."
                  rows="3"
                  maxLength="500"
                />
                <div className="character-count">
                  {formData.bio.length}/500 characters
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={loading || Object.keys(errors).length > 0}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Create Account</span>
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
              onClick={handleGoogleRegister}
              className="btn btn-secondary social-btn google-btn"
              disabled={loading}
            >
              <span className="social-icon">🌈</span>
              <span>Continue with Google</span>
            </button>

            {/* Sign In Link */}
            <div className="auth-footer">
              <p>
                Already have an account? 
                <Link to="/login" className="auth-link">
                  Sign In 🔑
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;





