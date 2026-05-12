import PropTypes from 'prop-types';

/**
 * Returns a styled avatar JSX element based on the user's role.
 * @param {string} role - The role of the user ('admin' or 'user').
 * @returns {JSX.Element} A styled span element with role-specific emoji and colors.
 */
export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 text-sm font-semibold">
        👑
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 text-sm font-semibold">
      📖
    </span>
  );
}

/**
 * Avatar component that renders a role-based avatar.
 * @param {Object} props
 * @param {'admin'|'user'} props.role - The role of the user.
 */
export function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
};

export default Avatar;