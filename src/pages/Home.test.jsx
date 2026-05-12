import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(() => ({
    userId: 'u1',
    username: 'johndoe',
    displayName: 'John Doe',
    role: 'user',
  })),
  clearSession: vi.fn(),
}));

import { getSession } from '../utils/auth';

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    getSession.mockReturnValue({
      userId: 'u1',
      username: 'johndoe',
      displayName: 'John Doe',
      role: 'user',
    });
  });

  function renderHome() {
    return render(
      <MemoryRouter initialEntries={['/blogs']}>
        <Home />
      </MemoryRouter>
    );
  }

  describe('page rendering', () => {
    it('renders the All Posts heading', () => {
      renderHome();
      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('renders the welcome message with display name', () => {
      renderHome();
      expect(screen.getByText(/Welcome back, John Doe/i)).toBeInTheDocument();
    });

    it('renders the New Post link', () => {
      renderHome();
      const newPostLink = screen.getByRole('link', { name: /New Post/i });
      expect(newPostLink).toBeInTheDocument();
      expect(newPostLink).toHaveAttribute('href', '/write');
    });
  });

  describe('empty state', () => {
    it('renders empty state message when no posts exist', () => {
      renderHome();
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });

    it('renders empty state description', () => {
      renderHome();
      expect(
        screen.getByText(/It looks like there are no blog posts yet/i)
      ).toBeInTheDocument();
    });

    it('renders Write Your First Post link in empty state', () => {
      renderHome();
      const writeLink = screen.getByRole('link', { name: /Write Your First Post/i });
      expect(writeLink).toBeInTheDocument();
      expect(writeLink).toHaveAttribute('href', '/write');
    });
  });

  describe('with posts', () => {
    const mockPosts = [
      {
        id: 'p1',
        title: 'First Blog Post',
        content: 'This is the content of the first blog post.',
        createdAt: '2024-06-15T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'John Doe',
      },
      {
        id: 'p2',
        title: 'Second Blog Post',
        content: 'This is the content of the second blog post.',
        createdAt: '2024-06-16T12:00:00.000Z',
        authorId: 'u2',
        authorName: 'Jane Smith',
      },
      {
        id: 'p3',
        title: 'Third Blog Post',
        content: 'This is the content of the third blog post.',
        createdAt: '2024-06-17T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'John Doe',
      },
    ];

    beforeEach(() => {
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));
    });

    it('renders all blog post titles', () => {
      renderHome();
      expect(screen.getByText('First Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Third Blog Post')).toBeInTheDocument();
    });

    it('renders post author names', () => {
      renderHome();
      expect(screen.getAllByText('John Doe').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('does not render empty state when posts exist', () => {
      renderHome();
      expect(screen.queryByText('No posts yet')).not.toBeInTheDocument();
      expect(
        screen.queryByText(/It looks like there are no blog posts yet/i)
      ).not.toBeInTheDocument();
    });

    it('renders blog card links to individual posts', () => {
      renderHome();
      const postLink = screen.getByRole('link', { name: 'First Blog Post' });
      expect(postLink).toHaveAttribute('href', '/blog/p1');
    });

    it('renders posts sorted by date descending (most recent first)', () => {
      renderHome();
      const postLinks = screen.getAllByRole('link', { name: /Blog Post/i });
      const titles = postLinks
        .filter((link) => link.getAttribute('href')?.startsWith('/blog/'))
        .map((link) => link.textContent);
      expect(titles[0]).toBe('Third Blog Post');
      expect(titles[1]).toBe('Second Blog Post');
      expect(titles[2]).toBe('First Blog Post');
    });
  });

  describe('edit icons based on user role/ownership', () => {
    const mockPosts = [
      {
        id: 'p1',
        title: 'My Own Post',
        content: 'Content of my own post.',
        createdAt: '2024-06-15T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'John Doe',
      },
      {
        id: 'p2',
        title: 'Someone Else Post',
        content: 'Content of someone else post.',
        createdAt: '2024-06-16T12:00:00.000Z',
        authorId: 'u2',
        authorName: 'Jane Smith',
      },
    ];

    beforeEach(() => {
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));
    });

    it('shows edit icon for posts owned by the current user', () => {
      getSession.mockReturnValue({
        userId: 'u1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      });

      renderHome();
      const editLinks = screen.getAllByTitle('Edit post');
      expect(editLinks.length).toBe(1);
      expect(editLinks[0]).toHaveAttribute('href', '/write?edit=p1');
    });

    it('does not show edit icon for posts not owned by the current user', () => {
      getSession.mockReturnValue({
        userId: 'u1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      });

      renderHome();
      const editLinks = screen.getAllByTitle('Edit post');
      const editHrefs = editLinks.map((link) => link.getAttribute('href'));
      expect(editHrefs).not.toContain('/write?edit=p2');
    });

    it('shows edit icons for all posts when user is admin', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderHome();
      const editLinks = screen.getAllByTitle('Edit post');
      expect(editLinks.length).toBe(2);
      const editHrefs = editLinks.map((link) => link.getAttribute('href'));
      expect(editHrefs).toContain('/write?edit=p1');
      expect(editHrefs).toContain('/write?edit=p2');
    });
  });

  describe('corrupted localStorage', () => {
    it('renders empty state when localStorage has corrupted posts data', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');
      renderHome();
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });
  });

  describe('navbar integration', () => {
    it('renders the WriteSpace logo link in navbar', () => {
      renderHome();
      const logoLinks = screen.getAllByRole('link', { name: /WriteSpace/i });
      const navLogo = logoLinks.find(
        (link) => link.getAttribute('href') === '/'
      );
      expect(navLogo).toBeDefined();
    });

    it('renders Blogs nav link', () => {
      renderHome();
      const blogsLinks = screen.getAllByRole('link', { name: /Blogs/i });
      const navBlogsLink = blogsLinks.find(
        (link) => link.getAttribute('href') === '/blogs'
      );
      expect(navBlogsLink).toBeDefined();
    });

    it('renders Write nav link', () => {
      renderHome();
      const writeLinks = screen.getAllByRole('link', { name: /Write/i });
      const navWriteLink = writeLinks.find(
        (link) => link.getAttribute('href') === '/write'
      );
      expect(navWriteLink).toBeDefined();
    });

    it('renders admin nav links when user is admin', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderHome();
      const adminDashLink = screen.getByRole('link', { name: /Admin Dashboard/i });
      expect(adminDashLink).toHaveAttribute('href', '/admin');
      const usersLink = screen.getByRole('link', { name: /Users/i });
      expect(usersLink).toHaveAttribute('href', '/admin/users');
    });

    it('does not render admin nav links for regular users', () => {
      getSession.mockReturnValue({
        userId: 'u1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      });

      renderHome();
      expect(screen.queryByRole('link', { name: /Admin Dashboard/i })).not.toBeInTheDocument();
    });

    it('displays the current user display name in navbar', () => {
      renderHome();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});