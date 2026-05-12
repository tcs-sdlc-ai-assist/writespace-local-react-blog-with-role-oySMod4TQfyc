import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers } from '../utils/storage';

const HARDCODED_ADMIN_USERNAME = 'admin';
const HARDCODED_ADMIN_PASSWORD = 'admin123';

/**
 * Login page component at '/login'.
 * Provides username/password form on a gradient background.
 * Checks hard-coded admin credentials first, then localStorage users.
 * On success, writes session and redirects by role.
 * Redirects already-authenticated users.
 */
export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (session) {
      navigate(session.role === 'admin' ? '/admin' : '/blogs', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError('All fields are required.');
      return;
    }

    // Check hard-coded admin credentials first
    if (trimmedUsername === HARDCODED_ADMIN_USERNAME && trimmedPassword === HARDCODED_ADMIN_PASSWORD) {
      setSession({
        userId: 'admin',
        username: HARDCODED_ADMIN_USERNAME,
        displayName: 'Admin',
        role: 'admin',
      });
      navigate('/admin', { replace: true });
      return;
    }

    // Check localStorage users
    try {
      const users = getUsers();
      const user = users.find(
        (u) => u.username === trimmedUsername && u.password === trimmedPassword
      );

      if (!user) {
        setError('Invalid username or password.');
        return;
      }

      setSession({
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      });

      navigate(user.role === 'admin' ? '/admin' : '/blogs', { replace: true });
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-white font-serif">
            WriteSpace
          </Link>
          <p className="mt-2 text-primary-200 text-sm">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-md px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;