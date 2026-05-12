import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { PublicNavbar } from '../components/PublicNavbar';
import { BlogCard } from '../components/BlogCard';

/**
 * Public landing page component.
 * Displays hero section with gradient background, tagline, and CTA buttons.
 * Features section highlighting platform capabilities.
 * Latest posts preview showing up to 3 most recent posts from localStorage.
 * Footer with links and copyright.
 */
export function LandingPage() {
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    try {
      const allPosts = getPosts();
      const sorted = [...allPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLatestPosts(sorted.slice(0, 3));
    } catch {
      setLatestPosts([]);
    }
  }, []);

  const features = [
    {
      icon: '✍️',
      title: 'Write & Publish',
      description:
        'Create and publish blog posts with a clean, distraction-free writing experience.',
      bgColor: 'bg-primary-100',
      textColor: 'text-primary-600',
    },
    {
      icon: '👥',
      title: 'Role-Based Access',
      description:
        'Admins manage users and content. Writers focus on creating great posts.',
      bgColor: 'bg-accent-100',
      textColor: 'text-accent-600',
    },
    {
      icon: '📊',
      title: 'Admin Dashboard',
      description:
        'Monitor platform activity with an intuitive dashboard for managing posts and users.',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
    },
    {
      icon: '🚀',
      title: 'Instant & Local',
      description:
        'No server needed. All data is stored locally in your browser for instant performance.',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-serif leading-tight">
              Your Space to{' '}
              <span className="text-accent-300">Write</span>,{' '}
              <span className="text-primary-200">Share</span> &{' '}
              <span className="text-amber-300">Inspire</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              WriteSpace is a simple, elegant blogging platform where you can
              create, manage, and share your stories with the world.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 rounded-md text-base font-medium text-primary-700 bg-white hover:bg-primary-50 transition-colors shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 rounded-md text-base font-medium text-white border-2 border-white/30 hover:bg-white/10 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">
              Why WriteSpace?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to start blogging, right in your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-100"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-lg ${feature.bgColor} ${feature.textColor} text-2xl mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">
              Latest Posts
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Check out what our community has been writing about.
            </p>
          </div>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No posts yet. Be the first to{' '}
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  write something
                </Link>
                !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary-600 font-serif">
                WriteSpace
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                Register
              </Link>
              <Link
                to="/blogs"
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                Blogs
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;