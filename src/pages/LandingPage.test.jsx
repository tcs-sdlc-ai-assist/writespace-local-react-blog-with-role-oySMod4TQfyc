import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingPage } from './LandingPage';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(() => null),
}));

import { getSession } from '../utils/auth';

describe('LandingPage', () => {
  beforeEach(() => {
    localStorage.clear();
    getSession.mockReturnValue(null);
  });

  function renderLandingPage() {
    return render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
  }

  describe('hero section', () => {
    it('renders the hero heading text', () => {
      renderLandingPage();
      expect(screen.getByText(/Your Space to/i)).toBeInTheDocument();
    });

    it('renders the hero tagline', () => {
      renderLandingPage();
      expect(
        screen.getByText(/WriteSpace is a simple, elegant blogging platform/i)
      ).toBeInTheDocument();
    });

    it('renders Get Started CTA link in hero', () => {
      renderLandingPage();
      const getStartedLinks = screen.getAllByRole('link', { name: /Get Started/i });
      expect(getStartedLinks.length).toBeGreaterThanOrEqual(1);
      expect(getStartedLinks[0]).toHaveAttribute('href', '/register');
    });

    it('renders Login CTA link in hero', () => {
      renderLandingPage();
      const loginLinks = screen.getAllByRole('link', { name: /Login/i });
      expect(loginLinks.length).toBeGreaterThanOrEqual(1);
      const heroLogin = loginLinks.find((link) => link.getAttribute('href') === '/login');
      expect(heroLogin).toBeDefined();
    });
  });

  describe('features section', () => {
    it('renders the features section heading', () => {
      renderLandingPage();
      expect(screen.getByText('Why WriteSpace?')).toBeInTheDocument();
    });

    it('renders the features section description', () => {
      renderLandingPage();
      expect(
        screen.getByText(/Everything you need to start blogging/i)
      ).toBeInTheDocument();
    });

    it('renders Write & Publish feature', () => {
      renderLandingPage();
      expect(screen.getByText('Write & Publish')).toBeInTheDocument();
      expect(
        screen.getByText(/Create and publish blog posts/i)
      ).toBeInTheDocument();
    });

    it('renders Role-Based Access feature', () => {
      renderLandingPage();
      expect(screen.getByText('Role-Based Access')).toBeInTheDocument();
      expect(
        screen.getByText(/Admins manage users and content/i)
      ).toBeInTheDocument();
    });

    it('renders Admin Dashboard feature', () => {
      renderLandingPage();
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(
        screen.getByText(/Monitor platform activity/i)
      ).toBeInTheDocument();
    });

    it('renders Instant & Local feature', () => {
      renderLandingPage();
      expect(screen.getByText('Instant & Local')).toBeInTheDocument();
      expect(
        screen.getByText(/No server needed/i)
      ).toBeInTheDocument();
    });
  });

  describe('latest posts section with no posts', () => {
    it('renders the Latest Posts heading', () => {
      renderLandingPage();
      expect(screen.getByText('Latest Posts')).toBeInTheDocument();
    });

    it('renders the Latest Posts description', () => {
      renderLandingPage();
      expect(
        screen.getByText(/Check out what our community has been writing about/i)
      ).toBeInTheDocument();
    });

    it('renders empty state message when no posts exist', () => {
      renderLandingPage();
      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /write something/i })
      ).toHaveAttribute('href', '/register');
    });
  });

  describe('latest posts section with posts', () => {
    const mockPosts = [
      {
        id: 'p1',
        title: 'First Blog Post',
        content: 'This is the content of the first blog post.',
        createdAt: '2024-06-15T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      },
      {
        id: 'p2',
        title: 'Second Blog Post',
        content: 'This is the content of the second blog post.',
        createdAt: '2024-06-16T12:00:00.000Z',
        authorId: 'u2',
        authorName: 'Bob',
      },
      {
        id: 'p3',
        title: 'Third Blog Post',
        content: 'This is the content of the third blog post.',
        createdAt: '2024-06-17T12:00:00.000Z',
        authorId: 'u1',
        authorName: 'Alice',
      },
      {
        id: 'p4',
        title: 'Fourth Blog Post',
        content: 'This is the content of the fourth blog post.',
        createdAt: '2024-06-18T12:00:00.000Z',
        authorId: 'u3',
        authorName: 'Charlie',
      },
    ];

    beforeEach(() => {
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));
    });

    it('renders up to 3 most recent posts', () => {
      renderLandingPage();
      expect(screen.getByText('Fourth Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Third Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
      expect(screen.queryByText('First Blog Post')).not.toBeInTheDocument();
    });

    it('renders post author names', () => {
      renderLandingPage();
      expect(screen.getAllByText('Alice').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('does not render empty state message when posts exist', () => {
      renderLandingPage();
      expect(screen.queryByText(/No posts yet/i)).not.toBeInTheDocument();
    });

    it('renders blog card links to individual posts', () => {
      renderLandingPage();
      const postLink = screen.getByRole('link', { name: 'Fourth Blog Post' });
      expect(postLink).toHaveAttribute('href', '/blog/p4');
    });
  });

  describe('latest posts section with corrupted localStorage', () => {
    it('renders empty state when localStorage has corrupted posts data', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');
      renderLandingPage();
      expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
    });
  });

  describe('footer', () => {
    it('renders the WriteSpace brand in footer', () => {
      renderLandingPage();
      const brandElements = screen.getAllByText('WriteSpace');
      expect(brandElements.length).toBeGreaterThanOrEqual(2);
    });

    it('renders copyright text', () => {
      renderLandingPage();
      const year = new Date().getFullYear();
      expect(
        screen.getByText(new RegExp(`© ${year} WriteSpace`))
      ).toBeInTheDocument();
    });

    it('renders footer Login link', () => {
      renderLandingPage();
      const loginLinks = screen.getAllByRole('link', { name: /Login/i });
      const footerLogin = loginLinks.find(
        (link) => link.getAttribute('href') === '/login'
      );
      expect(footerLogin).toBeDefined();
    });

    it('renders footer Register link', () => {
      renderLandingPage();
      const registerLinks = screen.getAllByRole('link', { name: /Register/i });
      const footerRegister = registerLinks.find(
        (link) => link.getAttribute('href') === '/register'
      );
      expect(footerRegister).toBeDefined();
    });

    it('renders footer Blogs link', () => {
      renderLandingPage();
      const blogsLink = screen.getByRole('link', { name: /Blogs/i });
      expect(blogsLink).toHaveAttribute('href', '/blogs');
    });
  });

  describe('public navbar', () => {
    it('renders the WriteSpace logo link in navbar', () => {
      renderLandingPage();
      const logoLinks = screen.getAllByRole('link', { name: /WriteSpace/i });
      const navLogo = logoLinks.find(
        (link) => link.getAttribute('href') === '/'
      );
      expect(navLogo).toBeDefined();
    });

    it('renders Login and Get Started buttons for guests', () => {
      renderLandingPage();
      const loginLinks = screen.getAllByRole('link', { name: /Login/i });
      expect(loginLinks.length).toBeGreaterThanOrEqual(1);
      const getStartedLinks = screen.getAllByRole('link', { name: /Get Started/i });
      expect(getStartedLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('renders Go to Dashboard link when user is logged in', () => {
      getSession.mockReturnValue({
        userId: 'user1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      });

      renderLandingPage();
      expect(
        screen.getByRole('link', { name: /Go to Dashboard/i })
      ).toHaveAttribute('href', '/blogs');
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders Go to Dashboard link pointing to /admin for admin users', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderLandingPage();
      expect(
        screen.getByRole('link', { name: /Go to Dashboard/i })
      ).toHaveAttribute('href', '/admin');
    });
  });
});