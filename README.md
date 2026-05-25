# Show Explorer

A responsive TV show browser built with Vue 3 + TypeScript, using the [TVMaze API](https://www.tvmaze.com/api).

**[Live Demo →](https://your-vercel-url.vercel.app)**

---

## Features

- **Dashboard** — genre carousels with top-rated shows, hero banner, search
- **Show Detail** — full metadata, cast, crew, related shows
- **Person View** — actor bio and their known shows
- **Timeline** — browse shows by premiere year with rating + genre filters
- **Map Explorer** — shows grouped by production country
- **Favorites** — save shows across views (session-scoped)
- **Dark / Light mode** — respects system preference, manual toggle
- **Accessibility** — WCAG 2.1 AA: keyboard nav, skip link, focus traps, aria-live, screen reader labels
- **Multilingual** — English and Dutch (lazy-loaded)

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run test      # unit tests (Vitest)
npm run test:coverage
npm run type-check
npm run build
```

---

## Architecture Decisions

### Framework: Vue 3 + TypeScript + Vite

Vue 3 Composition API was chosen over React or Svelte because it offers the best balance of clean composable logic, strong TypeScript integration, and wide adoption in the Dutch market. The Composition API lets each feature (search, favorites, timeline logic) live in a focused composable, independently testable and reusable, rather than being entangled in component state.

Vite was chosen over a meta-framework (Nuxt) because the assignment explicitly warns against over-scaffolding. A Vite SPA is the minimum viable build setup that still gets you HMR, TypeScript, path aliases, and optimized production output. Nuxt would add SSR, file-based routing, and auto-imports, none of which are needed here.

### Data Strategy: Batch Fetch + Client-Side Grouping

The TVMaze `/shows?page=N` endpoint returns around 250 shows per page. Rather than making one request per genre, we fetch pages 0–3 upfront (Promise.all,  around 1000 shows), then group, sort, and filter entirely client-side. This avoids the N+1 problem, 8 genres × 1 API call would be 8 serial requests instead of 4 parallel ones.

The tradeoff is a slightly larger initial payload, which is acceptable because TVMaze responses are compact (no full summaries on list endpoints) and the data is cached in the Pinia store for the session lifetime.

### Layered Architecture

```text
src/
├── services/ # API layer
├── composables/ # Business logic
├── stores/ # Global state
├── views/ # Route-level components
└── components/ # UI Components
```

The service layer has zero Vue dependency so that it can be tested with plain `vi.spyOn(globalThis, 'fetch')`. Composables own reactive state and call the service. Views own the lifecycle. Components are pure UI.

### Testing Philosophy

Tests verify **behavior, not implementation**. A test like `expect(component.data().internalFlag).toBe(true)` can breaks on any refactor. Instead, tests simulate what a user or another module would observe: does the rendered text match, does the router get called with the right params, does the error state appear on a 404 response.

### Routing: Hash History

`createWebHashHistory` was chosen for Vercel deployment simplicity. History mode requires a server-side catch-all rewrite rule; hash mode works on any static host with zero config.

### i18n: Lazy-Loaded Dutch

The English locale is bundled. Dutch is dynamically imported on first language switch — it is never included in the initial JS chunk for English users.

---

## Project Structure

```text
src/
├── components/
│ ├── common/ ShowCard, HeroBanner, CastSection, CrewSection, SearchBar, ...
│ └── layout/ AppShell, AppSidebar, AppHeader, AccessibilityModal
├── composables/ useMeta, useSearch, useDebounce, useTimeline, useShowMap, useLocale
├── locales/ en.ts, nl.ts
├── plugins/ i18n.ts
├── router/ index.ts
├── services/ tvmaze.ts
├── stores/ shows.ts, ui.ts
├── types/ tvmaze.ts, i18n.ts
├── views/ DashboardView, ShowDetailView, PersonView, TimelineView, MapView
└── _tests_/ unit tests (Vitest + @vue/test-utils)
```

---

## API Endpoints Used

| Endpoint | Used for |
| --- | --- |
| `GET /shows?page=N` | Batch load for dashboard, timeline, map |
| `GET /search/shows?q=` | Search feature |
| `GET /shows/:id` | Show detail page |
| `GET /shows/:id/cast` | Cast section |
| `GET /shows/:id/crew` | Crew section |
| `GET /people/:id` | Person view |
| `GET /people/:id/castcredits?embed=show` | Known-for grid on person page |

---

## Tech Stack

| Tool | Version | Why |
| --- | --- | --- |
| Vue 3 | 3.x | Composition API, strong TS support |
| TypeScript | 5.x | Type safety across the full stack |
| Vite | 6.x | Fast HMR, zero-config TS, optimized build |
| Vue Router | 4.x | Hash history, lazy-loaded routes |
| Pinia | 2.x | Simple reactive stores, Devtools support |
| Tailwind CSS | 4.x | Utility-first, no runtime overhead |
| Vitest | 3.x | Native Vite test runner, same config |
| vue-i18n | 9.x | Composition API mode, typed message schema |
