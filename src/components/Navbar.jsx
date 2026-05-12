import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../utils/auth';
import { Avatar } from './Avatar';

/**
 * Authenticated navigation bar component.
 * Shows logo, role-based nav links, avatar chip with display name,
 * logout dropdown, and mobile hamburger toggle.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const session = getSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/login');
  };

  const toggleMobile = () => {
    setMobileOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const isAdmin = session && session.role === 'admin';

  const navLinks = [
    { to: '/blogs', label: 'Blogs' },
    { to: '/write', label: 'Write' },
  ];

  if (isAdmin) {
    navLinks.push(
      { to: '/admin', label: 'Admin Dashboard' },
      { to: '/admin/users', label: 'Users' }
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600 font-serif">WriteSpace</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session && (
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Avatar role={session.role} />
                  <span className="text-sm font-medium text-gray-700">
                    {session.displayName}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMobile}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50 focus:outline-none transition-colors"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex items-center space-x-2 px-3 py-2">
                  <Avatar role={session.role} />
                  <span className="text-sm font-medium text-gray-700">
                    {session.displayName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;