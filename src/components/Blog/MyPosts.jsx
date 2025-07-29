import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Common/Loading';

const MyPosts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  // State to store user's posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch user's posts
const fetchMyPosts = async () => {
  try {
    setLoading(true);

    const response = await postsAPI.getMyPosts();
    
    // ✅ Extract only the posts array from the response
    setPosts(response.data.posts || []);

  } catch (error) {
    setError('Failed to load your posts.');
    console.error('Error fetching user posts:', error);
  } finally {
    setLoading(false);
  }
};

  // Function to delete a post
  const handleDelete = async (postId, postTitle) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return;
    }

    try {
      // Delete the post
      await postsAPI.deletePost(postId);
      
      // Remove the deleted post from the state
      setPosts(posts.filter(post => post._id !== postId));
      
    } catch (error) {
      alert('Failed to delete post. Please try again.');
      console.error('Error deleting post:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch posts when component mounts
  useEffect(() => {
    fetchMyPosts();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
        <Link to="/create" className="btn-primary">
          Write New Post
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Posts Yet</h2>
          <p className="text-gray-600 mb-6">You haven't written any blog posts yet.</p>
          <Link to="/create" className="btn-primary">
            Write Your First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map(post => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    {/* Post title */}
                    <td className="px-6 py-4">
                      <div>
                        <Link 
                          to={`/posts/${post._id}`}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600"
                        >
                          {post.title}
                        </Link>
                        <div className="text-sm text-gray-500 mt-1">
                          {post.content.substring(0, 100)}...
                        </div>
                      </div>
                    </td>
                    
                    {/* Publication status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    
                    {/* Creation date */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </td>
                    
                    {/* Action buttons */}
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          to={`/posts/${post._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/edit/${post._id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(post._id, post.title)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;