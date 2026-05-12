const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

/**
 * Retrieves all posts from localStorage.
 * @returns {Array<Object>} Array of post objects, or empty array on error.
 */
export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    if (data === null) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves an array of posts to localStorage.
 * @param {Array<Object>} posts - Array of post objects to persist.
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    // localStorage write failed (e.g., quota exceeded)
  }
}

/**
 * Retrieves all users from localStorage.
 * @returns {Array<Object>} Array of user objects, or empty array on error.
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data === null) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves an array of users to localStorage.
 * @param {Array<Object>} users - Array of user objects to persist.
 */
export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // localStorage write failed (e.g., quota exceeded)
  }
}