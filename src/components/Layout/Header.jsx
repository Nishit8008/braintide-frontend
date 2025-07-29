import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/Logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const [showAbout, setShowAbout] = useState(false);

  
  const handleLogout = () => {
    logout();
  };

  

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <img src={logo} alt="Braintide Logo" className="h-10 rounded-4xl w-auto" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              Brain<span className=" bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text  text-transparent font-brand italic">Tide</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 relative">
            {user ? (
              <>
                <Link to="/create" className="btn-primary cursor-pointer">
                  Write Post
                </Link>
                <Link to="/my-posts" className="text-gray-600 hover:text-gray-900 cursor-pointer">
                  My Posts
                </Link>
                <span className="text-gray-600">
                  Welcome, {user.username}!
                </span>
                <button onClick={handleLogout} className="btn-secondary cursor-pointer">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 cursor-pointer">
                  Login
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-gray-900 btn-primary cursor-pointer">
                  Register
                </Link>

                {/* About dropdown trigger */}
                <button
                  onClick={() => setShowAbout(!showAbout)}
                  className="text-gray-600 hover:text-gray-900 cursor-pointer focus:outline-none"
                >
                  About
                </button>

                {/* Dropdown box */}
                {showAbout && (
                  <div className="absolute top-12 right-0 bg-white border border-gray-200 shadow-lg rounded-md p-4 w-64 z-50">
                    <p className="text-sm text-gray-700">
                      <strong>Braintide</strong> is a platform for free minds.  
                      Share your thoughts, ideas, and stories without limits.  
                      Create, post, and connect in a space built for free will.
                    </p>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
