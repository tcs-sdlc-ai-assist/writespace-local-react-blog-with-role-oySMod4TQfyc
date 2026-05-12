import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import { Navbar } from '../components/Navbar';
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
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr || '';
  }
}

/**
 * Single blog post reading view at '/blog/:id'.
 * Displays title, author with avatar, formatted date, and full content.
 * Edit button links to /write?edit=:id. Delete button with confirmation dialog
 * removes post and redirects to /blogs.
 * Admin sees edit/delete on all posts; regular users see edit/delete only on own posts.
 * Handles invalid/missing IDs with 'Post not found' message.
 * Uses Navbar for authenticated navigation.
 */
export function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const session = getSession();

  useEffect(() => {
    try {
      const allPosts = getPosts();
      const found = allPosts.find((p) => p.id === id);
      if (found) {
        setPost(found);
        setNotFound(false);
      } else {
        setPost(null);
        setNotFound(true);
      }
    } catch {
      setPost(null);
      setNotFound(true);
    }
  }, [id]);

  const canEditOrDelete =
    session &&
    post &&
    (session.role === 'admin' || session.userId === post.authorId);

  const handleDelete = () => {
    try {
      const allPosts = getPosts();
      const updatedPosts = allPosts.filter((p) => p.id !== id);
      savePosts(updatedPosts);
      navigate('/blogs', { replace: true });
    } catch {
      // localStorage error; navigate anyway
      navigate('/blogs', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {notFound ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-600 text-3xl mb-4">
              📄
            </div>
            <h2 className="text-xl font-semibold text-gray-900 font-serif">
              Post not found
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              The blog post you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Link
              to="/blogs"
              className="mt-6 inline-flex items-center px-6 py-2.5 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Back to Blogs
            </Link>
          </div>
        ) : post ? (
          <article>
            <div className="mb-6">
              <Link
                to="/blogs"
                className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Blogs
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif leading-tight">
                  {post.title}
                </h1>

                {canEditOrDelete && (
                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    <Link
                      to={`/write?edit=${post.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      title="Edit post"
                    >
                      <svg
                        className="w-5 h-5"
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
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete post"
                    >
                      <svg
                        className="w-5 h-5"
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
                )}
              </div>

              <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-100">
                <Avatar role="user" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {post.authorName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>

              <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </article>
        ) : null}

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
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ReadBlog;