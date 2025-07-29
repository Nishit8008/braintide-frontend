import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Common/Loading';

const PostDetail = () => {
  // Get the post ID from the URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State to store the post data
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch a specific post
  const fetchPost = async () => {
    try {
      setLoading(true);
      
      // Make API call to get the post by ID
      const response = await postsAPI.getPost(id);
      setPost(response.data);
      
    } catch (error) {
      setError('Post not found or failed to load.');
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete the post
  const handleDelete = async () => {
    // Confirm deletion with user
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      // Make API call to delete the post
      await postsAPI.deletePost(id);
      
      // Redirect to home page after successful deletion
      navigate('/');
      
    } catch (error) {
      alert('Failed to delete post. Please try again.');
      console.error('Error deleting post:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch post data when component mounts
  useEffect(() => {
    fetchPost();
  }, [id]); // Re-fetch if the ID changes

  if (loading) return <Loading />;

  if (error || !post) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Post not found'}
        </div>
        <Link to="/" className="mt-4 inline-block btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  // Check if current user is the author of this post
  const isAuthor = user && user.id === post.author._id;

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to all posts
      </Link>

      {/* Post content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Post header */}
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center">
              <span>By {post.author.username}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
            
            {/* Show edit/delete buttons if user is the author */}
            {isAuthor && (
              <div className="flex gap-2">
                <Link 
                  to={`/edit/${post._id}`}
                  className="btn-secondary text-sm cursor-pointer border-2 hover:bg-black hover:text-white font-medium py-1 px-3 rounded transition-colors"
                >
                  Edit
                </Link>
                <button 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 cursor-pointer text-white text-sm font-medium py-1 px-3 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Post content */}
        <div className="prose max-w-none mb-6">
          {/* Split content by line breaks and render as paragraphs */}
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() ? (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ) : (
              <br key={index} />
            )
          ))}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostDetail;