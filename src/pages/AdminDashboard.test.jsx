import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(() => ({
    userId: 'admin',
    username: 'admin',
    displayName: 'Admin',
    role: 'admin',
  })),
  clearSession: vi.fn(),
}));

import { getSession } from '../utils/auth';

describe('AdminDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    getSession.mockReturnValue({
      userId: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    });
  });

  function renderDashboard() {
    return render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminDashboard />
      </MemoryRouter>
    );
  }

  describe('page rendering', () => {
    it('renders the welcome message with admin display name', () => {
      renderDashboard();
      expect(screen.getByText(/Welcome back, Admin/i)).toBeInTheDocument();
    });

    it('renders the overview description text', () => {
      renderDashboard();
      expect(
        screen.getByText(/Here's an overview of your platform activity/i)
      ).toBeInTheDocument();
    });

    it('renders the welcome message with custom display name', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Super Admin',
        role: 'admin',
      });
      renderDashboard();
      expect(screen.getByText(/Welcome back, Super Admin/i)).toBeInTheDocument();
    });
  });

  describe('stat cards with no data', () => {
    it('renders Total Posts stat card with 0', () => {
      renderDashboard();
      expect(screen.getByText('Total Posts')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders Total Users stat card with 1 (hard-coded admin)', () => {
      renderDashboard();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('renders Admins stat card with 1 (hard-coded admin)', () => {
      renderDashboard();
      expect(screen.getByText('Admins')).toBeInTheDocument();
    });

    it('renders Regular Users stat card with 0', () => {
      renderDashboard();
      expect(screen.getByText('Regular Users')).toBeInTheDocument();
    });
  });

  describe('stat cards with data', () => {
    const mockPosts = [
      {
        id: 'p1',
        title: 'Post One',
        content: 'Content one',
        createdAt: '2024-06-15T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'John Doe',
      },
      {
        id: 'p2',
        title: 'Post Two',
        content: 'Content two',
        createdAt: '2024-06-16T12:00:00.000Z',
        authorId: 'u2',
        authorName: 'Jane Smith',
      },
      {
        id: 'p3',
        title: 'Post Three',
        content: 'Content three',
        createdAt: '2024-06-17T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'John Doe',
      },
    ];

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
        displayName: 'Jane Smith',
        username: 'janesmith',
        password: 'pass456',
        role: 'user',
        createdAt: '2024-01-02T00:00:00.000Z',
      },
      {
        id: 'u3',
        displayName: 'Jane Admin',
        username: 'janeadmin',
        password: 'admin456',
        role: 'admin',
        createdAt: '2024-01-03T00:00:00.000Z',
      },
    ];

    beforeEach(() => {
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));
    });

    it('renders correct total posts count', () => {
      renderDashboard();
      expect(screen.getByText('Total Posts')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders correct total users count including hard-coded admin', () => {
      renderDashboard();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      // 3 localStorage users + 1 hard-coded admin = 4
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('renders correct admin count including hard-coded admin', () => {
      renderDashboard();
      expect(screen.getByText('Admins')).toBeInTheDocument();
      // 1 admin in localStorage + 1 hard-coded admin = 2
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders correct regular user count', () => {
      renderDashboard();
      expect(screen.getByText('Regular Users')).toBeInTheDocument();
    });
  });

  describe('quick action buttons', () => {
    it('renders Quick Actions heading', () => {
      renderDashboard();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });

    it('renders Write New Post link', () => {
      renderDashboard();
      const writeLink = screen.getByRole('link', { name: /Write New Post/i });
      expect(writeLink).toBeInTheDocument();
      expect(writeLink).toHaveAttribute('href', '/write');
    });

    it('renders Manage Users link', () => {
      renderDashboard();
      const usersLink = screen.getByRole('link', { name: /Manage Users/i });
      expect(usersLink).toBeInTheDocument();
      expect(usersLink).toHaveAttribute('href', '/admin/users');
    });
  });

  describe('recent posts section with no posts', () => {
    it('renders Recent Posts heading', () => {
      renderDashboard();
      expect(screen.getByText('Recent Posts')).toBeInTheDocument();
    });

    it('renders empty state message when no posts exist', () => {
      renderDashboard();
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });

    it('renders empty state description', () => {
      renderDashboard();
      expect(
        screen.getByText(/Get started by creating your first blog post/i)
      ).toBeInTheDocument();
    });

    it('renders Write Your First Post link in empty state', () => {
      renderDashboard();
      const writeLink = screen.getByRole('link', { name: /Write Your First Post/i });
      expect(writeLink).toBeInTheDocument();
      expect(writeLink).toHaveAttribute('href', '/write');
    });
  });

  describe('recent posts section with posts', () => {
    const mockPosts = [
      {
        id: 'p1',
        title: 'First Post',
        content: 'Content one',
        createdAt: '2024-06-10T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      },
      {
        id: 'p2',
        title: 'Second Post',
        content: 'Content two',
        createdAt: '2024-06-11T12:00:00.000Z',
        authorId: 'u2',
        authorName: 'Bob',
      },
      {
        id: 'p3',
        title: 'Third Post',
        content: 'Content three',
        createdAt: '2024-06-12T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      },
      {
        id: 'p4',
        title: 'Fourth Post',
        content: 'Content four',
        createdAt: '2024-06-13T12:00:00.000Z',
        authorId: 'u3',
        authorName: 'Charlie',
      },
      {
        id: 'p5',
        title: 'Fifth Post',
        content: 'Content five',
        createdAt: '2024-06-14T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      },
      {
        id: 'p6',
        title: 'Sixth Post',
        content: 'Content six',
        createdAt: '2024-06-15T12:00:00.000Z',
        authorId: 'u2',
        authorName: 'Bob',
      },
    ];

    beforeEach(() => {
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));
    });

    it('renders up to 5 most recent posts', () => {
      renderDashboard();
      expect(screen.getByText('Sixth Post')).toBeInTheDocument();
      expect(screen.getByText('Fifth Post')).toBeInTheDocument();
      expect(screen.getByText('Fourth Post')).toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.queryByText('First Post')).not.toBeInTheDocument();
    });

    it('does not render empty state when posts exist', () => {
      renderDashboard();
      expect(screen.queryByText('No posts yet')).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Get started by creating your first blog post/i)
      ).not.toBeInTheDocument();
    });

    it('renders View All link', () => {
      renderDashboard();
      const viewAllLink = screen.getByRole('link', { name: /View All/i });
      expect(viewAllLink).toBeInTheDocument();
      expect(viewAllLink).toHaveAttribute('href', '/blogs');
    });

    it('renders post links to individual posts', () => {
      renderDashboard();
      const postLink = screen.getByRole('link', { name: 'Sixth Post' });
      expect(postLink).toHaveAttribute('href', '/blog/p6');
    });

    it('renders edit links for posts', () => {
      renderDashboard();
      const editLinks = screen.getAllByTitle('Edit post');
      expect(editLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('renders delete buttons for posts', () => {
      renderDashboard();
      const deleteButtons = screen.getAllByTitle('Delete post');
      expect(deleteButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('renders post author names', () => {
      renderDashboard();
      expect(screen.getAllByText('Alice').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Bob').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('delete post functionality', () => {
    const mockPosts = [
      {
        id: 'p1',
        title: 'Post To Delete',
        content: 'Content one',
        createdAt: '2024-06-15T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      },
      {
        id: 'p2',
        title: 'Post To Keep',
        content: 'Content two',
        createdAt: '2024-06-16T12:00:00.000Z',
        authorId: 'u2',
        authorName: 'Bob',
      },
    ];

    beforeEach(() => {
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));
    });

    it('shows delete confirmation modal when delete button is clicked', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const deleteButtons = screen.getAllByTitle('Delete post');
      await user.click(deleteButtons[0]);

      expect(screen.getByText('Delete Post')).toBeInTheDocument();
      expect(
        screen.getByText(/Are you sure you want to delete this post/i)
      ).toBeInTheDocument();
    });

    it('closes delete confirmation modal when Cancel is clicked', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const deleteButtons = screen.getAllByTitle('Delete post');
      await user.click(deleteButtons[0]);

      expect(screen.getByText('Delete Post')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      await user.click(cancelButton);

      expect(screen.queryByText(/Are you sure you want to delete this post/i)).not.toBeInTheDocument();
    });

    it('deletes post when Delete is confirmed', async () => {
      const user = userEvent.setup();
      renderDashboard();

      expect(screen.getByText('Post To Delete')).toBeInTheDocument();
      expect(screen.getByText('Post To Keep')).toBeInTheDocument();

      const deleteButtons = screen.getAllByTitle('Delete post');
      await user.click(deleteButtons[0]);

      const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
      await user.click(confirmDeleteButton);

      // After deletion, the post should be removed from the list
      const remainingPosts = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(remainingPosts).toHaveLength(1);
    });
  });

  describe('corrupted localStorage', () => {
    it('renders empty state when localStorage has corrupted posts data', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');
      renderDashboard();
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });

    it('renders stat cards with default counts when localStorage is corrupted', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');
      localStorage.setItem('writespace_users', '{not valid json!!!');
      renderDashboard();
      expect(screen.getByText('Total Posts')).toBeInTheDocument();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('Admins')).toBeInTheDocument();
      expect(screen.getByText('Regular Users')).toBeInTheDocument();
    });
  });

  describe('navbar integration', () => {
    it('renders the WriteSpace logo link in navbar', () => {
      renderDashboard();
      const logoLinks = screen.getAllByRole('link', { name: /WriteSpace/i });
      const navLogo = logoLinks.find(
        (link) => link.getAttribute('href') === '/'
      );
      expect(navLogo).toBeDefined();
    });

    it('renders Blogs nav link', () => {
      renderDashboard();
      const blogsLinks = screen.getAllByRole('link', { name: /Blogs/i });
      const navBlogsLink = blogsLinks.find(
        (link) => link.getAttribute('href') === '/blogs'
      );
      expect(navBlogsLink).toBeDefined();
    });

    it('renders Write nav link', () => {
      renderDashboard();
      const writeLinks = screen.getAllByRole('link', { name: /Write/i });
      const navWriteLink = writeLinks.find(
        (link) => link.getAttribute('href') === '/write'
      );
      expect(navWriteLink).toBeDefined();
    });

    it('renders admin nav links for admin user', () => {
      renderDashboard();
      const adminDashLink = screen.getByRole('link', { name: /Admin Dashboard/i });
      expect(adminDashLink).toHaveAttribute('href', '/admin');
      const usersLink = screen.getByRole('link', { name: /^Users$/i });
      expect(usersLink).toHaveAttribute('href', '/admin/users');
    });

    it('displays the current admin display name in navbar', () => {
      renderDashboard();
      expect(screen.getAllByText('Admin').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('stat card emojis', () => {
    it('renders the posts emoji', () => {
      renderDashboard();
      expect(screen.getByText('📝')).toBeInTheDocument();
    });

    it('renders the users emoji', () => {
      renderDashboard();
      expect(screen.getByText('👥')).toBeInTheDocument();
    });

    it('renders the admins emoji', () => {
      renderDashboard();
      const crownEmojis = screen.getAllByText('👑');
      expect(crownEmojis.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the regular users emoji', () => {
      renderDashboard();
      const bookEmojis = screen.getAllByText('📖');
      expect(bookEmojis.length).toBeGreaterThanOrEqual(1);
    });
  });
});