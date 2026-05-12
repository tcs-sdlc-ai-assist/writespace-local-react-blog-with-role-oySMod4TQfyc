import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(() => null),
  setSession: vi.fn(),
}));

import { getSession, setSession } from '../utils/auth';

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    getSession.mockReturnValue(null);
  });

  function renderLoginPage() {
    return render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    );
  }

  describe('form rendering', () => {
    it('renders the WriteSpace logo link', () => {
      renderLoginPage();
      const logoLink = screen.getByRole('link', { name: /WriteSpace/i });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('renders the sign in heading text', () => {
      renderLoginPage();
      expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
    });

    it('renders the username input field', () => {
      renderLoginPage();
      const usernameInput = screen.getByLabelText(/Username/i);
      expect(usernameInput).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute('type', 'text');
    });

    it('renders the password input field', () => {
      renderLoginPage();
      const passwordInput = screen.getByLabelText(/Password/i);
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('renders the Sign In submit button', () => {
      renderLoginPage();
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('renders the Register link', () => {
      renderLoginPage();
      const registerLink = screen.getByRole('link', { name: /Register/i });
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('renders the "Don\'t have an account?" text', () => {
      renderLoginPage();
      expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('shows error when both fields are empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    });

    it('shows error when username is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(passwordInput, 'somepassword');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    });

    it('shows error when password is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      await user.type(usernameInput, 'someuser');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    });

    it('shows error when fields contain only whitespace', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, '   ');
      await user.type(passwordInput, '   ');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(screen.getByText('All fields are required.')).toBeInTheDocument();
    });
  });

  describe('hard-coded admin login', () => {
    it('logs in with hard-coded admin credentials and navigates to /admin', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin123');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(setSession).toHaveBeenCalledWith({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });

    it('does not show error on successful admin login', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin123');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(screen.queryByText('Invalid username or password.')).not.toBeInTheDocument();
      expect(screen.queryByText('All fields are required.')).not.toBeInTheDocument();
    });
  });

  describe('localStorage user login', () => {
    const mockUsers = [
      {
        id: 'u1',
        displayName: 'John Doe',
        username: 'johndoe',
        password: 'pass123',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'u2',
        displayName: 'Jane Admin',
        username: 'janeadmin',
        password: 'admin456',
        role: 'admin',
        createdAt: '2024-01-02T00:00:00.000Z',
      },
    ];

    beforeEach(() => {
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));
    });

    it('logs in with a regular user and navigates to /blogs', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, 'johndoe');
      await user.type(passwordInput, 'pass123');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(setSession).toHaveBeenCalledWith({
        userId: 'u1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });

    it('logs in with an admin user from localStorage and navigates to /admin', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, 'janeadmin');
      await user.type(passwordInput, 'admin456');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(setSession).toHaveBeenCalledWith({
        userId: 'u2',
        username: 'janeadmin',
        displayName: 'Jane Admin',
        role: 'admin',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  describe('failed login', () => {
    it('shows error for invalid username', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, 'nonexistent');
      await user.type(passwordInput, 'wrongpass');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });

    it('shows error for correct username but wrong password', async () => {
      const mockUsers = [
        {
          id: 'u1',
          displayName: 'John Doe',
          username: 'johndoe',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, 'johndoe');
      await user.type(passwordInput, 'wrongpassword');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });

    it('shows error for wrong admin password', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'wrongadminpass');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });

    it('does not call setSession on failed login', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, 'nonexistent');
      await user.type(passwordInput, 'wrongpass');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(setSession).not.toHaveBeenCalled();
    });

    it('does not navigate on failed login', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, 'nonexistent');
      await user.type(passwordInput, 'wrongpass');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('error clearing', () => {
    it('clears previous error on new submission attempt', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      // First attempt: empty fields
      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);
      expect(screen.getByText('All fields are required.')).toBeInTheDocument();

      // Second attempt: invalid credentials
      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, 'wrong');
      await user.type(passwordInput, 'wrong');
      await user.click(submitButton);

      expect(screen.queryByText('All fields are required.')).not.toBeInTheDocument();
      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });
  });

  describe('redirect behavior for authenticated users', () => {
    it('redirects authenticated regular user to /blogs', () => {
      getSession.mockReturnValue({
        userId: 'u1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      });

      renderLoginPage();

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });

    it('redirects authenticated admin user to /admin', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderLoginPage();

      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  describe('corrupted localStorage', () => {
    it('shows error when localStorage users data is corrupted', async () => {
      localStorage.setItem('writespace_users', '{not valid json!!!');

      const user = userEvent.setup();
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      await user.type(usernameInput, 'someuser');
      await user.type(passwordInput, 'somepass');

      const submitButton = screen.getByRole('button', { name: /Sign In/i });
      await user.click(submitButton);

      // getUsers returns [] for corrupted data, so user won't be found
      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });
  });
});