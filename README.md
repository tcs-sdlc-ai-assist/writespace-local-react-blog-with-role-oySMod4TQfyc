# WriteSpace

A simple, elegant blogging platform built with React where you can create, manage, and share your stories. All data is stored locally in your browser using localStorage — no server required.

## Tech Stack

- **React 18** — UI library
- **Vite** — Build tool and dev server
- **React Router v6** — Client-side routing
- **Tailwind CSS 3** — Utility-first styling
- **Vitest** — Unit testing framework
- **Testing Library** — Component testing utilities
- **PropTypes** — Runtime prop validation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Build

Create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run the test suite:

```bash
npm test
```

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment config
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component with routing
│   ├── index.css               # Tailwind CSS imports
│   ├── setup-tests.js          # Test setup (jest-dom)
│   ├── components/
│   │   ├── Avatar.jsx          # Role-based avatar component
│   │   ├── BlogCard.jsx        # Blog post card component
│   │   ├── Navbar.jsx          # Authenticated navigation bar
│   │   ├── ProtectedRoute.jsx  # Auth and role-based route guard
│   │   ├── PublicNavbar.jsx    # Public/guest navigation bar
│   │   ├── StatCard.jsx        # Admin dashboard stat card
│   │   └── UserRow.jsx         # User management row component
│   ├── pages/
│   │   ├── AdminDashboard.jsx  # Admin dashboard page
│   │   ├── Home.jsx            # Blog listing page
│   │   ├── LandingPage.jsx     # Public landing page
│   │   ├── LoginPage.jsx       # Login page
│   │   ├── ReadBlog.jsx        # Single blog post view
│   │   ├── RegisterPage.jsx    # Registration page
│   │   ├── UserManagement.jsx  # Admin user management page
│   │   └── WriteBlog.jsx       # Create/edit blog post page
│   └── utils/
│       ├── auth.js             # Session management utilities
│       └── storage.js          # localStorage read/write utilities
```

## Route Map

| Path            | Component         | Access        | Description                        |
| --------------- | ----------------- | ------------- | ---------------------------------- |
| `/`             | LandingPage       | Public        | Landing page with hero and features |
| `/login`        | LoginPage         | Public        | User login form                    |
| `/register`     | RegisterPage      | Public        | User registration form             |
| `/blogs`        | Home              | Authenticated | Blog post listing                  |
| `/blog/:id`     | ReadBlog          | Authenticated | Single blog post view              |
| `/write`        | WriteBlog         | Authenticated | Create a new blog post             |
| `/edit/:id`     | WriteBlog         | Authenticated | Edit an existing blog post         |
| `/admin`        | AdminDashboard    | Admin only    | Admin dashboard with stats         |
| `/admin/users`  | UserManagement    | Admin only    | User creation and management       |

## Features

- **Authentication** — Login and registration with session persistence in localStorage
- **Hard-coded Admin** — Built-in admin account (`admin` / `admin123`) available out of the box
- **Role-Based Access Control** — Admin and user roles with protected routes
- **Blog Management** — Create, read, edit, and delete blog posts
- **User Management** — Admins can create and delete user accounts
- **Admin Dashboard** — Platform overview with post and user statistics
- **Responsive Design** — Mobile-first layout with Tailwind CSS
- **Client-Side Storage** — All data persisted in browser localStorage
- **Character Counter** — Content field with 2000-character limit on the write page
- **Delete Confirmation** — Modal dialogs for destructive actions

## Default Admin Credentials

| Username | Password   |
| -------- | ---------- |
| `admin`  | `admin123` |

## Deployment

### Vercel

This project includes a `vercel.json` configuration for single-page application routing.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import the project in [Vercel](https://vercel.com/).
3. Vercel will auto-detect the Vite framework and configure the build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy. The `vercel.json` rewrites ensure all routes are handled by `index.html`.

### Manual / Other Platforms

1. Run `npm run build` to generate the `dist/` directory.
2. Serve the contents of `dist/` with any static file server.
3. Configure your server to redirect all routes to `index.html` for client-side routing support.

## License

Private — All rights reserved.