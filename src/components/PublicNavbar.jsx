import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { Avatar } from './Avatar';

/**
 * Public/guest navigation bar component.
 * Shows WriteSpace logo, 'Login' and 'Get Started' buttons for guests.
 * If user is logged in (session exists), shows avatar chip and 'Go to Dashboard' link.
 */
export function PublicNavbar() {
  const session = getSession();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600 font-serif">WriteSpace</span>
          </Link>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-2">
                  <Avatar role={session.role} />
                  <span className="text-sm font-medium text-gray-700">
                    {session.displayName}
                  </span>
                </div>
                <Link
                  to={session.role === 'admin' ? '/admin' : '/blogs'}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;