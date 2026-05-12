# Deployment Guide

This document covers deploying WriteSpace to production. WriteSpace is a fully client-side React single-page application (SPA) with no backend — all data is stored in the browser's localStorage.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build](#build)
- [Vercel Deployment](#vercel-deployment)
  - [Automatic Deployment via Git](#automatic-deployment-via-git)
  - [Manual Deployment via Vercel CLI](#manual-deployment-via-vercel-cli)
  - [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Other Static Hosting Platforms](#other-static-hosting-platforms)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Generic Static Server](#generic-static-server)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (included with Node.js)
- A [Vercel](https://vercel.com/) account (for Vercel deployment)

## Build

Create a production-optimized build:

```bash
npm install
npm run build
```

This runs `vite build` and outputs static files to the `dist/` directory. The output includes:

- `dist/index.html` — The single HTML entry point
- `dist/assets/` — Hashed JavaScript and CSS bundles

You can preview the production build locally before deploying:

```bash
npm run preview
```

This starts a local server (default `http://localhost:4173`) serving the `dist/` directory.

## Vercel Deployment

### Automatic Deployment via Git

This is the recommended approach:

1. Push your code to a Git repository on GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your repository.
4. Vercel auto-detects the Vite framework. Verify the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.

Vercel will automatically redeploy on every push to your default branch.

### Manual Deployment via Vercel CLI

1. Install the Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. Log in to your Vercel account:

   ```bash
   vercel login
   ```

3. From the project root, run:

   ```bash
   vercel
   ```

4. Follow the prompts. For production deployment:

   ```bash
   vercel --prod
   ```

### SPA Rewrite Configuration

WriteSpace uses client-side routing via React Router. All routes (e.g., `/blogs`, `/admin`, `/blog/some-id`) must be served by `index.html` so that React Router can handle them.

The project includes a `vercel.json` file at the repository root that configures this:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**How it works:**

- Any request to a path like `/blogs`, `/admin/users`, or `/blog/abc123` is rewritten to serve `index.html`.
- Once `index.html` loads, React Router reads the browser URL and renders the correct page component.
- Static assets in `dist/assets/` are served normally because Vercel serves existing files before applying rewrites.

**Important:** Do not remove or modify `vercel.json` unless you understand SPA routing. Without this rewrite rule, refreshing or directly navigating to any route other than `/` will result in a 404 error.

## Other Static Hosting Platforms

### Netlify

Create a `netlify.toml` file in the project root (or configure via the Netlify dashboard):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The `[[redirects]]` block is the Netlify equivalent of the Vercel SPA rewrite.

### GitHub Pages

GitHub Pages does not natively support SPA rewrites. You have two options:

1. **Use a 404.html workaround:** Copy `dist/index.html` to `dist/404.html` after building. GitHub Pages serves `404.html` for unknown routes, and React Router will handle the rest.

   ```bash
   npm run build
   cp dist/index.html dist/404.html
   ```

2. **Use HashRouter instead of BrowserRouter:** This changes URLs from `/blogs` to `/#/blogs`, avoiding the need for server-side rewrites. This requires modifying `src/App.jsx`.

### Generic Static Server

If you are using nginx, Apache, Caddy, or any other static file server:

1. Run `npm run build` to generate the `dist/` directory.
2. Serve the contents of `dist/` as your document root.
3. Configure a fallback rule so that all non-file requests serve `index.html`.

**nginx example:**

```nginx
server {
    listen 80;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache example (.htaccess in dist/):**

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Environment Variables

WriteSpace does **not** require any environment variables. There is no backend server, no API keys, and no database connection strings.

All data is stored in the browser's `localStorage`:

| localStorage Key       | Description                          |
| ---------------------- | ------------------------------------ |
| `writespace_posts`     | JSON array of blog post objects      |
| `writespace_users`     | JSON array of user account objects   |
| `writespace_session`   | JSON object for the active session   |

If you ever need to add environment variables in the future (e.g., for an analytics service), Vite requires them to be prefixed with `VITE_` and accessed via `import.meta.env.VITE_VARIABLE_NAME`. Create a `.env` file in the project root:

```
VITE_ANALYTICS_ID=your-id-here
```

The `.env` file is already listed in `.gitignore` and will not be committed to version control.

## Troubleshooting

### 404 errors when refreshing or navigating directly to a route

**Symptom:** Visiting `https://your-domain.com/blogs` directly or refreshing the page returns a 404 error.

**Cause:** The hosting server is looking for a file at `/blogs/index.html` which does not exist. WriteSpace is a single-page application — all routes must be served by the root `index.html`.

**Fix:** Ensure your hosting platform has SPA rewrite/redirect rules configured:

- **Vercel:** Verify `vercel.json` exists at the project root with the rewrite rule shown above.
- **Netlify:** Add a `_redirects` file in `dist/` with `/* /index.html 200` or use `netlify.toml`.
- **Other servers:** Configure a fallback to `index.html` for all non-file requests.

### Blank page after deployment

**Symptom:** The deployed site shows a blank white page with no content.

**Possible causes and fixes:**

1. **Build output missing:** Verify that `npm run build` completed successfully and the `dist/` directory contains `index.html` and an `assets/` folder.
2. **Incorrect output directory:** Ensure your hosting platform is configured to serve from `dist/`, not the project root.
3. **JavaScript errors:** Open the browser developer console (F12) and check for errors. Common issues include incorrect asset paths.
4. **Base path mismatch:** If deploying to a subdirectory (e.g., `https://example.com/app/`), you need to set the `base` option in `vite.config.js`:

   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/app/',
   });
   ```

### Data not persisting across sessions

**Symptom:** Blog posts, user accounts, or login sessions disappear after closing the browser.

**Cause:** WriteSpace stores all data in `localStorage`. Data may be lost if:

- The browser is in private/incognito mode (localStorage is cleared when the window closes).
- The user manually cleared browser data or localStorage.
- A browser extension is blocking or clearing localStorage.

**Note:** localStorage is specific to the browser and device. Data created on one device will not appear on another. This is by design — WriteSpace is a client-side-only application.

### Hard-coded admin account not working

**Symptom:** Cannot log in with the default admin credentials.

**Fix:** The hard-coded admin credentials are:

| Username | Password   |
| -------- | ---------- |
| `admin`  | `admin123` |

These credentials are checked in the application code before localStorage users. They cannot be changed or deleted through the UI. Ensure you are entering the credentials exactly as shown (case-sensitive, no extra spaces).

### Build fails with dependency errors

**Symptom:** `npm run build` fails with module not found or dependency resolution errors.

**Fix:**

1. Delete `node_modules/` and `package-lock.json`:

   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Reinstall dependencies:

   ```bash
   npm install
   ```

3. Run the build again:

   ```bash
   npm run build
   ```

### Tests failing before deployment

**Symptom:** `npm test` reports failures.

**Fix:** Run the test suite and review the output:

```bash
npm test
```

All tests should pass before deploying. The test suite uses Vitest with jsdom and Testing Library. If tests fail due to environment issues, ensure you are using Node.js v18 or higher.