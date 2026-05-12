import PropTypes from 'prop-types';
import { getSession } from '../utils/auth';
import { Avatar } from './Avatar';

const HARDCODED_ADMIN_USERNAME = 'admin';

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
 * User table row/card component for admin user management.
 * Displays avatar, display name, username, role badge pill, created date, and delete button.
 * Delete button is hidden for the hard-coded admin and for the currently logged-in admin (self-deletion prevention).
 *
 * @param {Object} props
 * @param {Object} props.user - The user object.
 * @param {string} props.user.id - User ID.
 * @param {string} props.user.displayName - User display name.
 * @param {string} props.user.username - User username.
 * @param {'admin'|'user'} props.user.role - User role.
 * @param {string} props.user.createdAt - ISO date string.
 * @param {Function} props.onDelete - Callback invoked with user id when delete is clicked.
 */
export function UserRow({ user, onDelete }) {
  const session = getSession();

  const isHardcodedAdmin = user.username === HARDCODED_ADMIN_USERNAME;
  const isSelf = session && session.userId === user.id;
  const canDelete = !isHardcodedAdmin && !isSelf;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar role={user.role} />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user.displayName}
            </p>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.role === 'admin'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-primary-100 text-primary-700'
            }`}
          >
            {user.role}
          </span>

          <span className="text-xs text-gray-400">
            {formatDate(user.createdAt)}
          </span>

          {canDelete ? (
            <button
              type="button"
              onClick={() => onDelete(user.id)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none"
              title="Delete user"
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
          ) : (
            <div className="w-8 h-8" />
          )}
        </div>
      </div>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;