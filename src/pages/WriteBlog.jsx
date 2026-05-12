import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import { Navbar } from '../components/Navbar';

const MAX_CONTENT_LENGTH = 2000;

/**
 * Generates a simple UUID v4-like string.
 * @returns {string} A unique identifier string.
 */
function generateId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
}

/**
 * Blog post creation and editing form page.
 * Serves '/write' for new posts and '/write?edit=:id' for editing existing posts.
 * In edit mode, loads post data and enforces ownership (user can edit own posts, admin can edit all).
 * Title and content fields with required validation. Character counter for content field.
 * Cancel button navigates back. On submit, saves post to localStorage via savePosts() and redirects to /blogs.
 * Uses Navbar for authenticated navigation.
 */
export function WriteBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getSession();

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (!editId) {
      setIsEditing(false);
      setEditPostId(null);
      return;
    }

    try {
      const allPosts = getPosts();
      const post = allPosts.find((p) => p.id === editId);

      if (!post) {
        setNotFound(true);
        return;
      }

      // Enforce ownership: user can edit own posts, admin can edit all
      if (session && (session.role === 'admin' || session.userId === post.authorId)) {
        setIsEditing(true);
        setEditPostId(post.id);
        setTitle(post.title);
        setContent(post.content);
        setNotFound(false);
      } else {
        navigate('/blogs', { replace: true });
      }
    } catch {
      setNotFound(true);
    }
  }, [searchParams, session, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content are required.');
      return;
    }

    if (trimmedContent.length > MAX_CONTENT_LENGTH) {
      setError(`Content must be ${MAX_CONTENT_LENGTH} characters or less.`);
      return;
    }

    try {
      const allPosts = getPosts();

      if (isEditing && editPostId) {
        const updatedPosts = allPosts.map((p) => {
          if (p.id === editPostId) {
            return {
              ...p,
              title: trimmedTitle,
              content: trimmedContent,
            };
          }
          return p;
        });
        savePosts(updatedPosts);
      } else {
        const newPost = {
          id: generateId(),
          title: trimmedTitle,
          content: trimmedContent,
          createdAt: new Date().toISOString(),
          authorId: session.userId,
          authorName: session.displayName,
        };
        savePosts([...allPosts, newPost]);
      }

      navigate('/blogs', { replace: true });
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate(-1);
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
              The blog post you&apos;re trying to edit doesn&apos;t exist or may have been removed.
            </p>
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="mt-6 inline-flex items-center px-6 py-2.5 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
                {isEditing ? 'Edit Post' : 'Write a New Post'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? 'Update your blog post below.'
                  : 'Share your thoughts with the community.'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-md px-4 py-3">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your post title"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Content
                    </label>
                    <span
                      className={`text-xs ${
                        content.length > MAX_CONTENT_LENGTH
                          ? 'text-rose-600 font-medium'
                          : 'text-gray-400'
                      }`}
                    >
                      {content.length}/{MAX_CONTENT_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-y"
                    placeholder="Write your blog post content here..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    {isEditing ? 'Update Post' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default WriteBlog;