import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Common/Loading';

const EditPost = () => {
  const { id } = useParams(); // Get post ID from URL
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for the post being edited
  const [post, setPost] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    published: false
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch the post data
  const fetchPost = async () => {
    try {
      setLoading(true);
      
      // Get the post data
      const response = await postsAPI.getPost(id);
      const postData = response.data;
      
      // Check if current user is the author
      if (!user || user.id !== postData.author._id) {
        setError('You are not authorized to edit this post.');
        return;
      }
      
      setPost(postData);
      
      // Populate form with existing post data
      setFormData({
        title: postData.title,
        content: postData.content,
        tags: postData.tags ? postData.tags.join(', ') : '',
        published: postData.published
      });
      
    } catch (error) {
      setError('Failed to load post data.');
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Prepare updated post data
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        published: formData.published,
        tags: formData.tags 
          ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : []
      };

      // Validate required fields
      if (!postData.title || !postData.content) {
        setError('Title and content are required.');
        setSubmitting(false);
        return;
      }

      // Make API call to update the post
      await postsAPI.updatePost(id, postData);
      
      // Redirect to the updated post
      navigate(`/posts/${id}`);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update post. Please try again.');
      console.error('Error updating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch post data when component mounts
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPost();
  }, [id, user]);

  // Show loading while fetching data
  if (loading) return <Loading />;

  // Show error if something went wrong
  if (error && !post) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Post</h1>
      
      {/* Error message display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Title field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your post title..."
            required
          />
        </div>

        {/* Content field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="12"
            className="input-field resize-vertical"
            placeholder="Write your post content here..."
            required
          />
        </div>

        {/* Tags field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., technology, web development, react"
          />
          <p className="text-gray-500 text-sm mt-1">
            Separate tags with commas
          </p>
        </div>

        {/* Published checkbox */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">
              Published
            </span>
          </label>
        </div>

        {/* Submit buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="btn-secondary"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className={`btn-primary ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;