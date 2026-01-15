# Curately Creator OS

A business intelligence ecosystem for creators, built on the "Give-to-Get" strategy.

**Give:** Professional Live Media Kits and Signal Invoicer  
**Get:** First-party, verified creator data via persistent OAuth connections

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, RSC) |
| UI | Shadcn UI + Tailwind CSS |
| Auth | Auth.js (NextAuth) v5 |
| Database | PostgreSQL + Prisma |
| Encryption | AES-256-GCM |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Cloud Console project (for YouTube OAuth)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/curately_db?schema=public"

# Auth.js
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# Google OAuth (YouTube)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Token Encryption (AES-256-GCM)
ENCRYPTION_KEY="generate-with-openssl-rand-hex-32"
```

Generate secrets:
```bash
# AUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY (64 hex characters)
openssl rand -hex 32
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Or run migrations (production)
npx prisma migrate dev
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
curately-creator-os/
├── prisma/
│   └── schema.prisma      # Database models
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/      # Auth.js route handlers
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── auth.ts            # Auth.js configuration
│   └── lib/
│       ├── encryption.ts  # AES-256-GCM utilities
│       └── prisma.ts      # Prisma singleton
├── docs/
│   └── PRD.md             # Product Requirements
└── .cursorrules           # AI development guidelines
```

---

## Phase 1 Features

### Unified Identity Management
- [ ] Single Sign-On (SSO)
- [ ] Multi-platform account linking (IG, TikTok, YouTube)
- [ ] Encrypted token storage

### Live Media Kit
- [ ] SEO-optimized public creator pages
- [ ] Real-time follower counts & engagement rates
- [ ] Audience demographics (Age/Gender/Geo)

### Signal Invoicer
- [ ] Structured invoice generation
- [ ] Brand name capture & normalization
- [ ] Deliverables tracking

---

## Data Models

### Identity Graph
- **User**: Core identity with `internal_uid`, email, name
- **Account**: Platform connections with encrypted tokens
- **AudienceSnapshot**: Time-series demographic data (JSONB)

### Supported Platforms
- YouTube (Google OAuth) - Planned
- Instagram Business API - Planned


---

## Development Guidelines

1. **Server Components by default** - Only use `'use client'` for interactive UI
2. **Mobile-first design** - 80% of users are on mobile
3. **No scrapers** - All data from official APIs or user input
4. **Encrypt all tokens** - Use `@/lib/encryption` for OAuth tokens
5. **Strict TypeScript** - No `any` types

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Documentation

- [Product Requirements (PRD)](docs/PRD.md) - Full project context and specifications
