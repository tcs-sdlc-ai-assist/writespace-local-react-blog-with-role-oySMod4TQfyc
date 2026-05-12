import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';

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
 * Registration page component at '/register'.
 * Provides display name, username, password, and confirm password form on a gradient background.
 * Validates all fields required, password match, and username uniqueness.
 * All self-registered accounts get 'user' role.
 * On success, saves user to localStorage, writes session, and redirects to '/blogs'.
 * Redirects already-authenticated users.
 */
export function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword || !trimmedConfirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const users = getUsers();
      const usernameExists = users.some((u) => u.username === trimmedUsername);

      if (usernameExists) {
        setError('Username is already taken.');
        return;
      }

      const newUser = {
        id: generateId(),
        displayName: trimmedDisplayName,
        username: trimmedUsername,
        password: trimmedPassword,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      saveUsers([...users, newUser]);

      setSession({
        userId: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
      });

      navigate('/blogs', { replace: true });
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
            Create your account
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
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Enter your display name"
                autoComplete="name"
              />
            </div>

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
                placeholder="Choose a username"
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
                placeholder="Create a password"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;