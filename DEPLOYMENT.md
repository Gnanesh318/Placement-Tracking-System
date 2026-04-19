# Deployment Runbook (Vercel + MySQL)

This project is now prepared for deployment to Vercel with a managed MySQL database.

## 1) Prerequisites

- Node.js 18+
- npm 9+
- Vercel account
- Managed MySQL instance (PlanetScale, Aiven, DigitalOcean, AWS RDS)

## 2) Required Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

- `DATABASE_URL`
  - Format: `mysql://USER:PASSWORD@HOST:3306/DB_NAME?charset=utf8mb4`
- `NEXTAUTH_SECRET`
  - Generate: `openssl rand -base64 32`
- `NEXTAUTH_URL`
  - Initially use your Vercel production URL (for example: `https://your-project.vercel.app`)
  - Update this after attaching a custom domain.
- Optional one-time admin bootstrap values:
  - `SEED_ADMIN_EMAIL`
  - `SEED_ADMIN_PASSWORD`

## 3) Local Validation Before Deploy

Run from repo root:

```bash
npm install
npm run db:generate
npm run build
```

## 4) Migration Artifacts

Initial migration artifacts are included under:

- `prisma/migrations/20260405000000_init/migration.sql`
- `prisma/migrations/migration_lock.toml`

Before first production traffic, apply migrations to production DB:

```bash
npm run db:migrate:deploy
```

Run that command in an environment where `DATABASE_URL` points to production.

## 5) Deploy to Vercel

### Option A: Git-integrated deployment (recommended)

1. Push code to your Git provider.
2. Import repo in Vercel.
3. Set environment variables in Vercel for `Production`.
4. Trigger deployment.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 6) Post-Deploy Smoke Tests

- Open `/login` and authenticate.
- Confirm role routing for `/admin` and `/student`.
- Check health endpoint:

```bash
curl https://YOUR_DEPLOYED_DOMAIN/api/health
```

Expected healthy response:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

## 7) One-Time Admin Bootstrap (optional)

If you need to create an admin after deployment, set:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

Then run:

```bash
npm run db:seed:admin
```

After successful creation, remove the seed env vars.

## 8) Notes

- Never commit real secrets.
- Keep `NEXTAUTH_URL` aligned with the active production domain.
- Existing warning in build: custom Google font loading strategy in `app/layout.tsx` can be improved later, but it does not block deployment.
