import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // API Base URL - this will be resolved at build time
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Debug: Log the API URL when component mounts
  useEffect(() => {
    console.log('🔧 AuthProvider initialized with API_BASE_URL:', API_BASE_URL);
    console.log('🔧 Full env check:', {
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      NODE_ENV: process.env.NODE_ENV
    });
  }, [API_BASE_URL]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    console.log('🔧 Login started with API URL:', API_BASE_URL);
    
    try {
      const fullUrl = `${API_BASE_URL}/auth/login`;
      console.log('🔧 Making login request to:', fullUrl);
      
      const response = await axios.post(fullUrl, credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔧 Login response:', response.data);
      
      if (response.data.success) {
        const { user: userData, token } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true };
      }
    } catch (error) {
      console.error('🔧 Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    console.log('🔧 Registration started with data:', userData);
    console.log('🔧 Using API_BASE_URL:', API_BASE_URL);
    
    try {
      const fullUrl = `${API_BASE_URL}/auth/register`;
      console.log('🔧 Making registration request to:', fullUrl);
      
      const response = await axios.post(fullUrl, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔧 Registration response:', response);
      console.log('🔧 Registration data:', response.data);
      
      if (response.data.success) {
        const { user: newUser, token } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        console.log('✅ Registration successful!');
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('🔧 Registration error:', error);
      console.error('🔧 Error response:', error.response);
      console.error('🔧 Error message:', error.message);
      
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully! 👋');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};




