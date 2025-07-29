// Import axios for making HTTP requests
import axios from 'axios';

// Define the base URL for our backend API
const API_URL = 'http://localhost:5000/api';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - runs before every request
api.interceptors.request.use((config) => {
  // Get the JWT token from localStorage
  const token = localStorage.getItem('token');
  
  // If token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => response, // If successful, just return the response
  (error) => {
    // If we get a 401 (unauthorized), remove token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  // Register a new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login existing user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Get current logged-in user info
  getCurrentUser: () => api.get('/auth/me'),
};

// Blog posts API functions
export const postsAPI = {
  // Get all published posts (public)
  getAllPosts: () => api.get('/posts'),
  
  // Get a specific post by ID
  getPost: (id) => api.get(`/posts/${id}`),
  
  // Create a new post (requires authentication)
  createPost: (postData) => api.post('/posts', postData),
  
  // Update an existing post (requires authentication)
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  
  // Delete a post (requires authentication)
  deletePost: (id) => api.delete(`/posts/${id}`),
  
  // Get current user's posts (requires authentication)
  getMyPosts: () => api.get('/posts/user/me'),
};