import { useState, useEffect } from 'react';
import { getUsers, saveUsers } from '../utils/storage';
import { getSession } from '../utils/auth';
import { Navbar } from '../components/Navbar';
import { UserRow } from '../components/UserRow';

const HARDCODED_ADMIN_USERNAME = 'admin';

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
 * Admin-only user management page at '/admin/users'.
 * Create user form with display name, username, password, and role fields.
 * Validates all fields and username uniqueness.
 * Responsive list of all users via UserRow components.
 * Delete button with confirmation dialog.
 * Hard-coded admin account cannot be deleted.
 * Logged-in admin cannot delete own account.
 * Uses Navbar and UserRow.
 */
export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const session = getSession();

  useEffect(() => {
    try {
      const allUsers = getUsers();
      setUsers(allUsers);
    } catch {
      setUsers([]);
    }
  }, []);

  const hardcodedAdmin = {
    id: 'admin',
    displayName: 'Admin',
    username: HARDCODED_ADMIN_USERNAME,
    role: 'admin',
    createdAt: new Date(0).toISOString(),
  };

  const allUsersWithAdmin = [hardcodedAdmin, ...users];

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('All fields are required.');
      return;
    }

    if (trimmedUsername === HARDCODED_ADMIN_USERNAME) {
      setError('Username is already taken.');
      return;
    }

    try {
      const currentUsers = getUsers();
      const usernameExists = currentUsers.some(
        (u) => u.username === trimmedUsername
      );

      if (usernameExists) {
        setError('Username is already taken.');
        return;
      }

      const newUser = {
        id: generateId(),
        displayName: trimmedDisplayName,
        username: trimmedUsername,
        password: trimmedPassword,
        role: role,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...currentUsers, newUser];
      saveUsers(updatedUsers);
      setUsers(updatedUsers);

      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('user');
      setSuccess(`User "${trimmedDisplayName}" created successfully.`);
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  const handleDeleteConfirm = (userId) => {
    setShowDeleteConfirm(userId);
  };

  const handleDelete = (userId) => {
    try {
      const currentUsers = getUsers();
      const updatedUsers = currentUsers.filter((u) => u.id !== userId);
      saveUsers(updatedUsers);
      setUsers(updatedUsers);
      setShowDeleteConfirm(null);
    } catch {
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
            User Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create new accounts and manage existing users.
          </p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 font-serif mb-4">
            Create New User
          </h2>

          <form onSubmit={handleCreateUser} className="space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-md px-4 py-3">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-md px-4 py-3">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  placeholder="Enter display name"
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
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 font-serif">
              All Users ({allUsersWithAdmin.length})
            </h2>
          </div>

          {allUsersWithAdmin.length > 0 ? (
            <div className="space-y-3">
              {allUsersWithAdmin.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onDelete={handleDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-600 text-2xl mb-4">
                👥
              </div>
              <h3 className="text-lg font-semibold text-gray-900 font-serif">
                No users yet
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Create your first user using the form above.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 text-xl mb-4">
                🗑️
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete User
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;