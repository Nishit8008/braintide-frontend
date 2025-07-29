// ===== src/App.jsx =====
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import PostList from './components/Blog/PostList';
import PostDetail from './components/Blog/PostDetail';
import CreatePost from './components/Blog/CreatePost';
import EditPost from './components/Blog/EditPost';
import MyPosts from './components/Blog/MyPosts';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Loading from './components/Common/Loading';

// Protected Route component - only allows access if user is logged in
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading while checking authentication status
  if (loading) {
    return <Loading />;
  }
  
  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the protected component
  return children;
};

// Public Route component - redirects to home if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading while checking authentication status
  if (loading) {
    return <Loading />;
  }
  
  // If already authenticated, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  // If not authenticated, render the public component (login/register)
  return children;
};

// Main App component
function App() {
  return (
    // Wrap the entire app with AuthProvider to provide authentication context
    <AuthProvider>
      {/* Set up React Router for navigation */}
      <Router>
        {/* Wrap all pages with the Layout component */}
        <Layout>
          {/* Define all the routes/pages of our application */}
          <Routes>
            {/* Home page - shows all blog posts */}
            <Route path="/" element={<PostList />} />
            
            {/* Individual post page */}
            <Route path="/posts/:id" element={<PostDetail />} />
            
            {/* Login page - only accessible if not logged in */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* Register page - only accessible if not logged in */}
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* Create new post page - requires authentication */}
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } 
            />
            
            {/* Edit post page - requires authentication */}
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              } 
            />
            
            {/* My posts page - requires authentication */}
            <Route 
              path="/my-posts" 
              element={
                <ProtectedRoute>
                  <MyPosts />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route - redirects any unknown URLs to home page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;