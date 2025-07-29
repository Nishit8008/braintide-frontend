// Enhanced PostList.jsx with debugging and better empty states
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import PostItem from './PostItem';
import Loading from '../Common/Loading';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching posts from API...');
      const response = await postsAPI.getAllPosts();
      
      console.log('API Response:', response);
      console.log('Posts data:', response.data);
      
      // Handle different response formats
      let postsArray = [];
      if (Array.isArray(response.data)) {
        // Direct array format: [post1, post2, ...]
        postsArray = response.data;
      } else if (response.data && Array.isArray(response.data.posts)) {
        // Object format: {posts: [post1, post2, ...], pagination: {...}}
        postsArray = response.data.posts;
      } else {
        console.warn('Unexpected response format:', response.data);
      }
      
      console.log('Processed posts array:', postsArray);
      setPosts(postsArray);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      
      let errorMessage = 'Failed to load posts';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running on http://localhost:5000';
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Show loading spinner
  if (loading) {
    return (
      <div className="text-center py-12">
        <Loading />
        <p className="mt-4 text-gray-600">Loading posts...</p>
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 max-w-2xl mx-auto">
          <h3 className="font-semibold mb-2">Error Loading Posts</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={fetchPosts}
          className="btn-primary"
        >
          Try Again
        </button>
        
        {/* Debug info */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto text-left">
          <h4 className="font-semibold mb-2">Troubleshooting:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Make sure your backend server is running: <code>npm run dev</code> in blog-api folder</li>
            <li>• Check if backend is accessible: <a href="http://localhost:5000" target="_blank" className="text-blue-600">http://localhost:5000</a></li>
            <li>• Verify MongoDB is connected (check backend terminal)</li>
          </ul>
        </div>
      </div>
    );
  }

  // Show empty state when no posts exist
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Blog!</h2>
          <p className="text-gray-600 mb-8">
            No blog posts yet. Be the first to share your thoughts!
          </p>
          
          {/* Show different options based on authentication */}
          <div className="space-y-4">
            <Link 
              to="/register" 
              className="block btn-primary"
            >
              Create Account to Start Writing
            </Link>
            <Link 
              to="/login" 
              className="block btn-secondary"
            >
              Already have an account? Login
            </Link>
          </div>
          
          {/* Debug info */}
          {/* <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
            <h4 className="font-semibold mb-2">Debug Info:</h4>
            <ul className="text-sm text-gray-700">
              <li>• Posts array length: {posts.length}</li>
              <li>• API endpoint: http://localhost:5000/api/posts</li>
              <li>• Loading state: {loading.toString()}</li>
              <li>• Error state: {error || 'none'}</li>
            </ul>
          </div> */}
        </div>
      </div>
    );
  }

  // Show posts list
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Latest Blog Posts</h1>
        <p className="text-gray-600">{posts.length} post{posts.length !== 1 ? 's' : ''} found</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
      
      {/* Debug info */}
      {/* <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <pre className="text-xs text-gray-600 overflow-auto">
          {JSON.stringify(posts.map(p => ({ id: p._id, title: p.title, author: p.author?.username })), null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

export default PostList;