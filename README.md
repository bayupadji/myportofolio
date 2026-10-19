# Bayu — Product Designer (UI/UX) Portfolio & Studio CMS

A high-craft personal portfolio website and studio content management system built for a **generalist Product Designer (UI/UX)**. Engineered to demonstrate design rigor, proven business impact, and modern frontend architecture.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS Token Variables |
| **Database & ORM** | [SQLite](https://sqlite.org/) (via `better-sqlite3` in WAL mode) + [Drizzle ORM](https://orm.drizzle.team/) |
| **Server State** | [TanStack Query v5](https://tanstack.com/query) |
| **UI State** | [Zustand](https://github.com/pmndrs/zustand) |
| **E2E Testing** | [Playwright](https://playwright.dev/) (Chromium, auth session caching, auto-cleanup) |
| **Unit Testing** | Node.js Test Runner via `tsx` |
| **Design System** | WCAG 2.2 AA accessible, 8px grid system, Dark/Light/System theme tokens |

---

## 🏛️ Architecture: Pragmatic Clean Architecture

The codebase adheres strictly to Clean Architecture separation of concerns:

```
src/
  ├── domain/          # Enterprise business rules (Entities, Value Objects, Repository Interfaces)
  ├── application/     # Application use cases & DTOs (No framework dependencies)
  ├── infrastructure/  # External adapters (SQLite/Drizzle repositories, FileStorage, Auth sessions)
  ├── presentation/    # UI Layer (Components, Layout, Hooks, Server Actions, Zustand stores)
  └── app/             # Thin Next.js App Router endpoints & layouts
```

- **Dependency Rule:** `presentation` → `application` → `domain` ← `infrastructure`.
- **Public & Admin Isolation:** Public routes render Server Components (SSG/ISR) for optimal SEO & sub-second load times; private CMS routes at `/admin` enforce role verification and idle timeout sessions.

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Variables

Create `.env.local` based on `.env.example`:

```bash
# Admin credentials (development)
ADMIN_USERNAME=skyviadmin
ADMIN_PASSWORD=skyvi1234
AUTH_SECRET=dev_portfolio_secret_key_8f7b2c9e4a1d6f3e5b8a0c2d4e6f8a1b
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live portfolio.

---

## 🧪 Testing Suite

### Unit Testing
Runs domain rule validations, session token HMAC checks, rate limiting, and PDF MIME header tests:

```bash
npm test
```

### End-to-End (E2E) Testing with Playwright
Covers 10 Critical User Journeys (CUJ) including Happy Paths and realistic Failure States:

```bash
# Run all E2E tests headless
npm run test:e2e

# Interactive Time-Travel Debugging UI mode
npm run test:e2e:ui

# CI mode with retries and GitHub/HTML reports
npm run test:e2e:ci
```

---

## 🔒 Admin CMS Studio (`/admin`)

- **Secure Login:** Rate-limited authentication with HMAC SHA-256 session tokens.
- **Session Protection:** 30-minute idle sliding timeout + 2-hour absolute expiration window.
- **Case Studies Manager:** Live Markdown editor, TL;DR framing, metric callouts, and publish/draft toggles.
- **Freelance Availability:** 1-click status switch syncing live status ribbon across public navigation.
- **Inbound Messages:** Anti-spam honeypot filtering with direct client brief inbox.
- **Audience & Traffic Intelligence:** Real-time privacy-friendly analytics chart (7-day / 30-day views).

---

## 📄 License

Private & Proprietary. All rights reserved © 2026 Bayu.
