import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';

// Note: For production, implement actual Google OAuth flow
// This is a simplified version for demonstration
const GoogleAuth = ({ onSuccess, isLoading }) => {
  const { googleAuth } = useAuth();

  const handleGoogleAuth = async () => {
    // In a real implementation, you would:
    // 1. Initialize Google Auth with your client ID
    // 2. Show Google sign-in popup
    // 3. Get user data and tokens
    // 4. Send to your backend

    try {
      // Simulated Google auth response
      // Replace this with actual Google OAuth implementation
      const mockGoogleResponse = {
        googleId: '123456789',
        email: 'user@gmail.com',
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/150'
      };

      // In real implementation, get this data from Google OAuth
      const result = await googleAuth(mockGoogleResponse);
      
      if (result.success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={isLoading}
      className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <FcGoogle className="w-5 h-5" />
      <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
    </button>
  );
};

export default GoogleAuth;
