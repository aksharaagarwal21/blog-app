import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Remove the baseURL since we're using proxy in package.json
// axios.defaults.baseURL is handled by the proxy configuration

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
  console.log('🔄 API Request:', {
    method: request.method.toUpperCase(),
    url: request.url,
    baseURL: request.baseURL || 'Using proxy'
  });
  return request;
});

// Add response interceptor for debugging  
axios.interceptors.response.use(
  response => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



