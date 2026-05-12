import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { Avatar } from './Avatar';

const borderColors = [
  'border-t-primary-500',
  'border-t-accent-500',
  'border-t-amber-500',
  'border-t-emerald-500',
  'border-t-rose-500',
  'border-t-violet-500',
];

/**
 * Truncates content to a given max length and appends ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length.
 * @returns {string} Truncated text.
 */
function truncate(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

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
 * Reusable blog post card component.
 * Displays title, excerpt, formatted date, author name with avatar.
 * Shows edit icon if current user is admin or is the post author.
 * Links to /blog/:id for reading.
 *
 * @param {Object} props
 * @param {Object} props.post - The post object.
 * @param {string} props.post.id - Post ID.
 * @param {string} props.post.title - Post title.
 * @param {string} props.post.content - Post content.
 * @param {string} props.post.createdAt - ISO date string.
 * @param {string} props.post.authorId - Author user ID.
 * @param {string} props.post.authorName - Author display name.
 * @param {number} [props.index=0] - Index for cycling border color.
 */
export function BlogCard({ post, index = 0 }) {
  const session = getSession();
  const colorClass = borderColors[index % borderColors.length];

  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 border-t-4 ${colorClass} overflow-hidden hover:shadow-md transition-shadow`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <Link
            to={`/blog/${post.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors font-serif line-clamp-2"
          >
            {post.title}
          </Link>
          {canEdit && (
            <Link
              to={`/write?edit=${post.id}`}
              className="ml-2 flex-shrink-0 text-gray-400 hover:text-primary-600 transition-colors"
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
          )}
        </div>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {truncate(post.content)}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar role="user" />
            <span className="text-sm font-medium text-gray-700">
              {post.authorName}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number,
};

export default BlogCard;