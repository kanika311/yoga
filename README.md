# Mumma-Move Sutras

Unified **Next.js** app (frontend + MongoDB API in one folder), Tailwind CSS, and CMS at `/admin-yoga`.

## Folder structure

```
app/
  (public)/          Public pages (home, yoga, blog, contact)
  api/               Backend API routes
  admin-yoga/        CMS
  layout.tsx
  globals.css
  robots.ts
  sitemap.ts
components/          Shared UI
contexts/            Auth context
hooks/
lib/                 DB, auth, API helpers
models/              Mongoose schemas
public/              Logo and static files
scripts/             seed.ts
types/
middleware.ts
```

## Setup

1. MongoDB running (local or Atlas URI in `.env`)
2. From this folder:

```bash
npm install
npm run seed
npm run dev
```

3. Open http://localhost:3000
4. CMS: http://localhost:3000/admin-yoga

### CMS login

- Email: `admin@healinsutras.com`
- Password: `Admin@123`

Copy `.env.example` to `.env` and set `MONGO_URI` / `JWT_SECRET`.
