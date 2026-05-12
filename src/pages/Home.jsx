import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import { Navbar } from '../components/Navbar';
import { BlogCard } from '../components/BlogCard';

/**
 * Authenticated blog list page at '/blogs'.
 * Displays all posts from localStorage in a responsive grid of BlogCard components.
 * Shows empty state message with CTA to write first post if no posts exist.
 * Uses Navbar for authenticated navigation.
 */
export function Home() {
  const [posts, setPosts] = useState([]);
  const session = getSession();

  useEffect(() => {
    try {
      const allPosts = getPosts();
      const sorted = [...allPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sorted);
    } catch {
      setPosts([]);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
              All Posts
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {session
                ? `Welcome back, ${session.displayName}`
                : 'Browse all blog posts'}
            </p>
          </div>
          <Link
            to="/write"
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Post
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 text-3xl mb-4">
              ✍️
            </div>
            <h2 className="text-xl font-semibold text-gray-900 font-serif">
              No posts yet
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              It looks like there are no blog posts yet. Be the first to share
              your thoughts with the community!
            </p>
            <Link
              to="/write"
              className="mt-6 inline-flex items-center px-6 py-2.5 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Write Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;