const SESSION_KEY = 'writespace_session';

/**
 * Retrieves the current session from localStorage.
 * @returns {Object|null} Session object with userId, username, displayName, role — or null if no session or on error.
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data === null) {
      return null;
    }
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Saves a session object to localStorage.
 * @param {Object} session - Session object containing userId, username, displayName, and role.
 */
export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage write failed (e.g., quota exceeded)
  }
}

/**
 * Clears the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // localStorage removal failed
  }
}