import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/auth';

/**
 * Route guard component for authentication and role-based access control.
 * Checks session in localStorage via auth.js.
 * Redirects unauthenticated guests to /login.
 * If role prop is 'admin' and current user role is not 'admin', redirects to /blogs.
 * Renders children if authorized.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized.
 * @param {'admin'|'user'} [props.role] - Optional required role for access.
 * @returns {JSX.Element}
 */
export function ProtectedRoute({ children, role }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && session.role !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.oneOf(['admin', 'user']),
};

export default ProtectedRoute;