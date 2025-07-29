import { Link } from 'react-router-dom';

const PostItem = ({ post }) => {

   console.log("PostItem Link ID:", post._id);

  // Function to format the date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to truncate content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Post Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        <Link 
          to={`/posts/${post._id}`} 
          className="hover:text-blue-600 transition-colors"
        >
          {post.title}
        </Link>
      </h2>

      {/* Post Meta Information */}
      <div className="flex items-center text-gray-600 text-sm mb-3">
        <span>By {post.author.username}</span>
        <span className="mx-2">•</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>

      {/* Post Content Preview */}
      <p className="text-gray-700 mb-4">
        {truncateContent(post.content)}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Read More Link */}
     

      <Link 
        to={`/posts/${post._id}`}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Read more →
      </Link>
    </article>
  );
};


export default PostItem;