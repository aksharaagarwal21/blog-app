import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateBlog from './pages/Blog/CreateBlog';
import EditBlog from './pages/Blog/EditBlog';
import BlogView from './pages/Blog/BlogView';
import Profile from './pages/Profile/Profile';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';

import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Blog Routes - Public (anyone can view blogs) */}
                <Route path="/blog/:id" element={<BlogView />} />
                
                {/* Protected Routes - Require Authentication */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/create-blog" element={
                  <ProtectedRoute>
                    <CreateBlog />
                  </ProtectedRoute>
                } />
                
                <Route path="/edit-blog/:id" element={
                  <ProtectedRoute>
                    <EditBlog />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                {/* Redirect Routes */}
                <Route path="/blogs" element={<Navigate to="/" replace />} />
                <Route path="/my-blogs" element={<Navigate to="/dashboard" replace />} />
                
                {/* Catch-all route for 404 - Redirect to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Toast Notifications */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-medium)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--success-500)',
                    secondary: 'white',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--error-500)',
                    secondary: 'white',
                  },
                },
                loading: {
                  iconTheme: {
                    primary: 'var(--primary-500)',
                    secondary: 'white',
                  },
                },
              }}
            />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;










