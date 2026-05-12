# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-15

### Added

- **Public Landing Page** — Hero section with gradient background, tagline, and call-to-action buttons; features section highlighting platform capabilities; latest posts preview showing up to 3 most recent posts; footer with navigation links and copyright.
- **Authentication** — Login and registration pages with form validation and session persistence in localStorage. Hard-coded admin account (`admin` / `admin123`) available out of the box. Already-authenticated users are automatically redirected.
- **Blog CRUD** — Create, read, edit, and delete blog posts. Write page with title and content fields, 2000-character limit with live character counter. Edit mode loads existing post data and enforces ownership. Delete confirmation modal for destructive actions.
- **Admin Dashboard** — Admin-only dashboard at `/admin` with gradient welcome header, four stat cards (total posts, total users, admin count, regular user count), quick-action buttons for writing posts and managing users, and a recent posts section showing the 5 most recent posts with edit and delete actions.
- **User Management** — Admin-only user management page at `/admin/users` with a create user form (display name, username, password, role selection) and a list of all users displayed via UserRow components. Username uniqueness validation. Delete confirmation modal with protection against deleting the hard-coded admin or the currently logged-in admin.
- **Role-Based Access Control** — ProtectedRoute component for authentication and role-based route guarding. Unauthenticated users are redirected to `/login`. Non-admin users attempting to access admin routes are redirected to `/blogs`. Edit icons on blog cards are shown only to post authors and admins.
- **Avatar System** — Role-based avatar component displaying crown emoji (👑) for admins and book emoji (📖) for regular users, with role-specific background colors.
- **localStorage Persistence** — All data (posts, users, sessions) stored in browser localStorage via dedicated utility modules (`storage.js` for posts and users, `auth.js` for session management). Graceful error handling for corrupted data and quota exceeded scenarios.
- **Responsive Tailwind UI** — Mobile-first responsive design using Tailwind CSS 3 with custom color palette (primary and accent), custom font families (Inter, Merriweather, Fira Code), and utility-first styling throughout all components. Authenticated navbar with mobile hamburger menu and dropdown logout. Public navbar with login/register buttons for guests and dashboard link for authenticated users.
- **Vercel Deployment Support** — `vercel.json` configuration with URL rewrites for single-page application routing.
- **Component Library** — Reusable components including BlogCard (post preview with colored top border, truncated content, author avatar, formatted date, and conditional edit icon), StatCard (dashboard statistics display), UserRow (user management row with role badge, delete button, and self-deletion prevention), Navbar (authenticated navigation), and PublicNavbar (guest navigation).
- **Testing Infrastructure** — Vitest test suite with Testing Library for component testing, jsdom environment, and jest-dom matchers. Comprehensive tests for utility modules, page components, and integration scenarios.