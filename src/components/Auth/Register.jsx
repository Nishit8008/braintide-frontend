import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  // Get register function from auth context
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form state - stores all form input values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Loading state - shows when form is being submitted
  const [loading, setLoading] = useState(false);
  
  // Error state - stores any error messages
  const [error, setError] = useState('');

  // Function to handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,                    // Keep existing form data
      [e.target.name]: e.target.value // Update the specific field that changed
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);   // Show loading state
    setError('');       // Clear any previous errors

    // Call register function from auth context
    const result = await register(formData);

    if (result.success) {
      // Registration successful - redirect to home page
      navigate('/');
    } else {
      // Registration failed - show error message
      setError(result.error);
    }

    setLoading(false); // Hide loading state
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      
      {/* Show error message if there is one */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Username field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input-field border-2 rounded-full px-1.5"
            required
          />
        </div>

        {/* Email field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field border-2 rounded-full px-1.5"
            required
          />
        </div>

        {/* Password field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field border-2 rounded-full px-1.5"
            required
            minLength="6"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className= {`w-full  btn-primary cursor-pointer rounded-full border-blue-800 border-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      {/* Link to login page */}
      <p className="text-center mt-4 text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-800">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;