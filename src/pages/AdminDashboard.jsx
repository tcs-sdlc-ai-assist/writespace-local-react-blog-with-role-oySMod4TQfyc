import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, savePosts, getUsers } from '../utils/storage';
import { getSession } from '../utils/auth';
import { Navbar } from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { Avatar } from '../components/Avatar';

/**
 * Formats an ISO date string to a human-readable format.
 * @param {string} dateStr - ISO date string.
 * @returns {string} Formatted date string.
 */
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr || '';
  }
}

/**
 * Admin-only dashboard page at '/admin'.
 * Displays gradient header with welcome message.
 * Four StatCard components showing total posts, total users, admin count, and regular user count.
 * Quick-action buttons for writing a new post and managing users.
 * Recent posts section showing 5 most recent posts with edit/delete actions.
 * Uses Navbar, StatCard, and Avatar.
 */
export function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const session = getSession();
  const navigate = useNavigate();

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

    try {
      const allUsers = getUsers();
      setUsers(allUsers);
    } catch {
      setUsers([]);
    }
  }, []);

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const regularUserCount = users.filter((u) => u.role === 'user').length;

  const recentPosts = posts.slice(0, 5);

  const handleDelete = (postId) => {
    try {
      const allPosts = getPosts();
      const updatedPosts = allPosts.filter((p) => p.id !== postId);
      savePosts(updatedPosts);
      const sorted = [...updatedPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sorted);
      setShowDeleteConfirm(null);
    } catch {
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Gradient Header */}
        <div className="rounded-lg bg-gradient-to-r from-primary-600 via-primary-700 to-accent-700 p-6 sm:p-8 mb-8">
          <div className="flex items-center space-x-4">
            <Avatar role="admin" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                Welcome back, {session ? session.displayName : 'Admin'}
              </h1>
              <p className="mt-1 text-sm text-primary-200">
                Here&apos;s an overview of your platform activity.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={totalPosts}
            label="Total Posts"
            icon="📝"
            bgColor="bg-primary-100"
            textColor="text-primary-600"
          />
          <StatCard
            value={totalUsers}
            label="Total Users"
            icon="👥"
            bgColor="bg-accent-100"
            textColor="text-accent-600"
          />
          <StatCard
            value={adminCount}
            label="Admins"
            icon="👑"
            bgColor="bg-amber-100"
            textColor="text-amber-600"
          />
          <StatCard
            value={regularUserCount}
            label="Regular Users"
            icon="📖"
            bgColor="bg-emerald-100"
            textColor="text-emerald-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 font-serif mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/write"
              className="inline-flex items-center px-5 py-2.5 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
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
              Write New Post
            </Link>
            <Link
              to="/admin/users"
              className="inline-flex items-center px-5 py-2.5 rounded-md text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Manage Users
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 font-serif">
              Recent Posts
            </h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors font-serif truncate block"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1">
                          <Avatar role="user" />
                          <span className="text-xs text-gray-500">
                            {post.authorName}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                      <Link
                        to={`/write?edit=${post.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        title="Edit post"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(post.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete post"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-600 text-2xl mb-4">
                ✍️
              </div>
              <h3 className="text-lg font-semibold text-gray-900 font-serif">
                No posts yet
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Get started by creating your first blog post.
              </p>
              <Link
                to="/write"
                className="mt-4 inline-flex items-center px-5 py-2.5 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Write Your First Post
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 text-xl mb-4">
                🗑️
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Post
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;