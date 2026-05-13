# CLAUDE.md — DESIST! Website

> Drop this file at the root of `chris-wedesist/website` as `CLAUDE.md`. Claude Code loads it into context every session.

## What this repo is

DESIST! Website is the **"strategic" surface** of the DESIST! (Digital Emergency Safety & Incident Support Tool) platform — a civil rights safety hub used calmly (laptop / desktop) before or after high-pressure encounters with law enforcement, ICE, or other authority figures. User state is analytical or social. Core features: community forums with AI moderation, incident reporting and viewing, events, attorney/legal help search, civil rights news feeds, account management.

This is one of two surfaces. The companion is a React Native mobile app (`chris-wedesist/mobile_app`). Both surfaces point at the same Supabase project — see "The Bridge" below.

## Stack — what's actually installed

- **Next.js 15.3.2**, **React 19**, **TypeScript 5**
- **Tailwind CSS**
- **Prisma ORM** with **SQLite** — must migrate to PostgreSQL (Supabase). This is HANDOVER issue #9.
- **Auth.js v5 / NextAuth** — must be ripped out (see auth fragmentation below).
- **Supabase Auth** — the auth system that stays.
- **nodemailer** (Gmail-backed, hardcoded creds — see security section).
- **Google Gemini** (community AI moderation).
- **OpenStreetMap Overpass API** (attorney search).
- RSS feeds: CBS, NPR, NBC.

**Hosting:** Vercel. Integration likely via GitHub. No `vercel.json` present. Deploy CI step is a placeholder.

## Auth fragmentation — the most important thing to understand

There are **two completely separate, incompatible auth systems running in parallel today.** This is the single most consequential piece of tech debt in this repo.

- **System 1: NextAuth v5 + Prisma/SQLite** — wired to `/auth/signin`, `/account`
- **System 2: Supabase Auth** — wired to `/auth/login`, `/auth/register`, community, incidents, events

Users who sign in via different routes get different sessions with **no shared state**. Community and incident features check Supabase auth only — NextAuth sessions are useless for those features.

**Additional runtime risk:** `src/auth.js` imports from `auth.js` (not a real npm package). It will throw a module-not-found error at runtime.

**Target end state:** Supabase Auth only. Eliminate NextAuth entirely. Do not write new code against NextAuth. If you touch an auth-adjacent file, move it toward Supabase Auth — don't preserve the dual-system pattern.

## Security — known issues, fix before any public exposure

These are committed-to-the-repo secrets. Treat any PR that does not move toward fixing them as suspect:

1. **Supabase URL and anon key hardcoded** in `utils/supabase.ts` and two API routes. Move to env.
2. **Gmail credentials (address + app password) hardcoded** in the contact and request API routes. Move to env. Rotate the app password after the move.
3. **No `.env` file present.** Google OAuth, NextAuth, and Gemini will silently fail without env vars. Document required env vars in `.env.example`.

## What works vs. what doesn't — current ground truth

**Verified working (real backend wired):**
- `/auth/login`, `/auth/register` via Supabase Auth
- `/incidents` (view + report) via Supabase DB
- `/events` (view + create) via Supabase DB
- `/community` forums with Gemini-based AI moderation
- `/legal-help/attorneys` via OpenStreetMap Overpass API
- `/blog/news` via live RSS feeds
- `/contact`, `/request` via nodemailer (hardcoded Gmail creds — security issue)

**UI-only with no backend:**
- `/resources` — hardcoded static sample data
- Newsletter signup — explicitly mocked with `setTimeout`, no real API call
- `/support/emergency` — static hardcoded contact list
- `/features/stealth-mode` — static marketing page only
- `/press`, `/about`, `/download` — static content

## The 10 critical issues — `HANDOVER.md`

The canonical pre-launch punch list lives in `HANDOVER.md`. Verbatim:

1. SSO / Unified Authentication Integration
2. Community & Incident System Load Testing
3. Accessibility Final Audit
4. Legal Documents & Privacy Compliance
5. Newsletter & Email Service Integration
6. Incident Reporting Security & Reliability
7. Support Documentation & Helpdesk
8. Performance Optimization & SEO
9. Production Database Migration (SQLite → PostgreSQL)
10. Security Audit & Penetration Testing

When picking up a task, anchor it to an issue number from this list where possible.

## Design constraints — NON-NEGOTIABLE

- **No red backgrounds anywhere.** The DESIST! logo uses white and red only — that's the only acceptable use of red as a fill.
- Visual tone: serious, clear, trust-building, professional. Never cartoonish.
- Stakeholder and investor-facing pages: clean McKinsey / BCG aesthetic — simple, clear, no drop shadows, no unnecessary embellishments.
- Font usage consistent across all surfaces.
- **WCAG 2.1 AA alignment required.** Accessibility is HANDOVER issue #3.

## The Bridge — cross-surface context

Both surfaces use Supabase project `tscvzrxnxadnvgnsdrqx.supabase.co`. The mobile app writes to a `panic_events` table; this site reads / writes to an `incidents` table. These need to be synced so a mobile Panic Event appears in this site's Incident Dashboard for the user's circle of trust. RLS policies must be defined accordingly.

The mobile app has **no auth implementation yet** — all its writes are currently anonymous. When mobile gets Supabase Auth, the bridge becomes useful. Coordinate schema changes with the mobile repo.

## Conventions

- TypeScript strict — do not loosen it.
- Tailwind utility classes — match existing component patterns.
- Don't extend NextAuth. New auth code goes through Supabase Auth.
- When migrating a Prisma/SQLite-backed feature, move it to Supabase in the same PR — don't introduce a third intermediate state.
- Folder organization is logical and purpose-driven — match existing patterns.

## Where to find more context

- `HANDOVER.md` — the 10 critical issues
- Privacy Policy, Terms of Service, Cookie Policy (last updated 2026-01-16)
- Press kit page — logos, brand colors, press releases

## What NOT to do

- Don't add code to NextAuth. It's being removed.
- Don't add new Prisma/SQLite tables. New data goes to Supabase / Postgres.
- Don't use a red background anywhere.
- Don't add new hardcoded Supabase keys, Gmail creds, or any other secrets to source. Use env.
- Don't introduce drop shadows or visual embellishments on stakeholder-facing pages.
- Don't soften technical debt in commit messages or PR descriptions — call it out directly.
- Don't import from `auth.js` (the broken `src/auth.js` import). If you touch that file, fix it or remove it.
