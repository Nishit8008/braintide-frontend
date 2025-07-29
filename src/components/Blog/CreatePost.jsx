import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to login if user is not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  // Form state to store post data
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    published: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      // For checkboxes, use 'checked' property, for other inputs use 'value'
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare post data for API
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        published: formData.published,
        // Convert tags string to array (split by comma and trim whitespace)
        tags: formData.tags 
          ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : []
      };

      // Validate required fields
      if (!postData.title || !postData.content) {
        setError('Title and content are required.');
        setLoading(false);
        return;
      }

      // Make API call to create the post
      const response = await postsAPI.createPost(postData);
      
      // Redirect to the newly created post
      navigate(`/posts/${response.data.post._id}`);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post. Please try again.');
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>
      
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
          <p className="text-gray-500 text-sm mt-1">
            Tip: Use line breaks to separate paragraphs
          </p>
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
              Publish immediately
            </span>
          </label>
          <p className="text-gray-500 text-sm mt-1">
            Uncheck to save as draft
          </p>
        </div>

        {/* Submit buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating...' : (formData.published ? 'Publish Post' : 'Save Draft')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;