// Import necessary React hooks and API functions
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component that wraps the entire app
export const AuthProvider = ({ children }) => {
  // State to store current user information
  const [user, setUser] = useState(null);
  
  // State to track if we're still loading user data
  const [loading, setLoading] = useState(true);

  // Function to handle user login
  const login = async (credentials) => {
    try {
      // Make login request to backend
      const response = await authAPI.login(credentials);
      
      // Extract token and user data from response
      const { token, user } = response.data;
      
      // Store token in localStorage for persistence
      localStorage.setItem('token', token);
      
      // Update user state
      setUser(user);
      
      return { success: true };
    } catch (error) {
      // Return error message if login fails
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  // Function to handle user registration
  const register = async (userData) => {
    try {
      // Make registration request to backend
      const response = await authAPI.register(userData);
      
      // Extract token and user data from response
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update user state
      setUser(user);
      
      return { success: true };
    } catch (error) {
      // Return error message if registration fails
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  // Function to handle user logout
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Clear user state
    setUser(null);
  };

  // Effect to check if user is already logged in when app loads
  useEffect(() => {
    const initializeAuth = async () => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token is still valid by getting current user
          const response = await authAPI.getCurrentUser();
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('token');
        }
      }
      
      // Finished loading
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // The value object that will be provided to all components
  const value = {
    user,        // Current user data
    login,       // Login function
    register,    // Register function
    logout,      // Logout function
    loading,     // Loading state
  };

  // Provide the context value to all child components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};