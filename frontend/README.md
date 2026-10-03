# Portfolio frontend

The public site is a Next.js 16 and React 19 application. It is intentionally
organised by responsibility rather than by an AI-generated single-page pattern.

## Start locally

```bash
npm install
npm run dev
```

The default API URL is `http://localhost:8001`. Set `NEXT_PUBLIC_API_URL` when
the Java API is hosted elsewhere.

## Verify a change

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Do not run `next build` while another `next dev` process owns `.next/lock`; use a
separate worktree or stop that local development server first.

## Where to begin reading

- `app/page.tsx` — route-level browser behaviour only.
- `components/sections/EditorialLanding.tsx` — public homepage composition root.
- `features/landing/` — homepage content, loading hook, and visual sections.
- `services/apiClient.ts` — shared HTTP and error boundary.
- `services/*.ts` — endpoint-specific request functions.
- `types/api.ts` — API response contracts shared by UI and services.

Read the repository-wide [frontend learning guide](../docs/frontend-learning-guide.md)
before making a larger refactor. It explains the boundaries and gives focused
exercises rather than treating this project as a polished template to copy blindly.
