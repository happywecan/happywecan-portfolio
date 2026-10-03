# Frontend refactor learning guide

This project is intentionally a portfolio application, not a framework demo. The
goal is to practice the decisions a teammate needs to understand when they open a
real product repository: where data comes from, what owns a screen, how a request
fails, and how a change is verified.

## Read the public home page in this order

1. `frontend/app/page.tsx` owns only the route-level browser behaviour. It does
   not contain page sections or API calls.
2. `frontend/components/sections/EditorialLanding.tsx` is the composition root.
   It wires editable data to visual sections but intentionally contains almost no
   layout markup.
3. `frontend/features/landing/useLandingSettings.ts` loads the public settings.
   Its cancellation guard prevents a late request from changing state after the
   page unmounts.
4. `frontend/features/landing/landingContent.ts` holds portfolio copy that is
   product content, rather than React implementation detail.
5. The `LandingHero`, `PositioningSection`, `WorkShowcase`, and `NotesSection`
   components each own one visible region. A section is a good component boundary
   when it has a stable visual responsibility, not merely because it has many
   lines of JSX.

The visual DOM, Tailwind classes, anchors, and public copy stay the same after
this refactor. The change is about ownership, not a cosmetic rewrite.

## Frontend request boundary

All frontend services should call `services/apiClient.ts`. It owns the API base
URL, request headers, JSON parsing, and the common `ApiError` shape. Feature
services (`contactService`, `portfolioService`, `staticContentService`, and so
on) should only describe their endpoint and request/response type.

Avoid importing a service merely to obtain a constant from it. The old homepage
did this via `staticContentService -> authService -> apiClient`; the current
direction is `feature service -> apiClient`. This prevents a content feature from
being coupled to authentication and avoids hidden circular dependencies.

## Practical exercises

Do these as small commits, not as one large rewrite:

1. Add a third case study in `landingContent.ts`; verify that the grid still works
   on mobile and desktop.
2. Move case studies from static data to the existing portfolio API. Define the
   loading, empty, and error state before writing the fetch call.
3. Add a `LandingSettings` skeleton that preserves the page layout while the
   settings request is pending.
4. Write a component test for `LandingHero`: a title with one word should not
   render an empty second line; a two-word title should render both lines.
5. Replace the broad `SiteSettings` interface with smaller feature-specific
   response types only after the Java API is changed to serve those contracts.

## Review checklist for AI-generated code

- Is there one source of truth, or two code paths that render the same feature?
- Can a reader identify the data boundary without scanning a whole page?
- Does each `useEffect` have a lifecycle reason and a cleanup strategy?
- Are errors represented consistently at the API boundary?
- Does the change preserve keyboard navigation, reduced-motion needs, and the
  existing responsive layout?
- Is the feature verifiable using lint, type checking, a test, and a manual flow?

AI can produce a good first draft quickly. Treat that output as a proposed
implementation: keep the useful structure, delete dead paths, name boundaries,
and verify behaviours yourself. That review work is engineering, not a failure to
use AI correctly.
