# DotTech Flow — Internal Task Management & Code Review Portal

A production-oriented internal portal for DotTech Solutions where administrators manage employees, assign tasks and projects, review code submissions and demo URLs, track company-wide progress, and manage integrations.

---

## Build Status

- Next.js 16 production build — 26 routes — exit code 0
- TypeScript check passed
- All API routes verified
- Role-based access control enforced (server-side)
- Submission versioning system active
- In-memory store with realistic seed data

---

## Quick Start

```bash
npm install
npm run dev
```

Visit **http://localhost:3000** — you'll be redirected to `/login`.

---

## Demo Credentials (password: `password123`)

| Role | Email | Name |
|------|-------|------|
| Admin | admin@dottech.com | Sarah Jenkins |
| Employee | alex@dottech.com | Alex Rivera |
| Employee | marcus@dottech.com | Marcus Chen |
| Employee | elena@dottech.com | Elena Rostova |

---

## npm Scripts

```bash
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npx tsc --noEmit     # TypeScript type check
npx prisma generate  # Regenerate Prisma client
npx prisma studio    # Open Prisma GUI
```

---

## Pages

| Route | Role | Description |
|-------|------|-------------|
| `/login` | Public | Sign in |
| `/admin/dashboard` | Admin | Analytics overview |
| `/admin/employees` | Admin | Employee directory |
| `/admin/projects` | Admin | Projects portfolio |
| `/admin/tasks` | Admin | All tasks table |
| `/admin/reviews` | Admin | Code review queue |
| `/admin/analytics` | Admin | Velocity analytics |
| `/admin/integrations` | Admin | GitHub/Resend/WhatsApp |
| `/admin/audit-logs` | Admin | Audit trail |
| `/employee/dashboard` | Employee | Personalized workspace |
| `/employee/my-tasks` | Employee | Assigned tasks |
| `/employee/submissions` | Employee | Submission history |

---

## Architecture

- **Auth**: JWT in HttpOnly cookies, server-side role checks, Edge middleware
- **Store**: In-memory seed data (swap `src/lib/store.ts` for Prisma + PostgreSQL in production)
- **Workflow**: Assigned → In Progress → Submitted → In Review → Approved/Changes Requested → Completed
- **Submissions**: Append-only versioned records
- **Webhooks**: HMAC SHA-256 verified GitHub webhooks at `/api/webhooks/github`

---

## Production Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel dashboard
3. Set env vars: `APP_SECRET`, `DATABASE_URL`, `GITHUB_WEBHOOK_SECRET`, `RESEND_API_KEY`
4. Run `npx prisma migrate deploy` in build command
5. Deploy
firebase login
