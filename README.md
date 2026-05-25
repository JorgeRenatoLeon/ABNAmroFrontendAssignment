# TV Shows App

TV show Library web app (Vue 3, TypeScript, and the [TVMaze public API](https://www.tvmaze.com/api)).

## Live Demo

> Add your Vercel URL here after deployment

***

## Features

- Browse popular TV shows grouped by genre in horizontal carousels.
- Top Rated section featuring the top rated shows.
- Filter the dashboard by a specific genre.
- Search any TV show by name with debounced API calls.
- Full show detail page with its details, cast, and related shows.
- Skeleton loading states for every component that needs it.
- Keyboard navigation on all interactive elements.
- Accessible markup with semantic HTML and ARIA labels.

***

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
git clone https://github.com/JorgeRenatoLeon/ABNAmroFrontendAssignment
cd abn-amro-assignment
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

There is also a component viewer at [http://localhost:5173/#/test/components](http://localhost:5173/#/test/components) that renders all the components in isolation.

### Run Tests

```bash
npm run test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Type Check

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

***

## Architecture Decisions

### Framework: Vue 3 + TypeScript

Vue 3 with the Composition API was chosen over React or Svelte for several reasons. The Composition API enables clean separation between reactive state, derived state, and side effects, all colocated in composables rather than scattered across lifecycle hooks or a class component. TypeScript adds compile-time safety for the TVMaze API contract, which has nullable fields throughout (ratings, images, networks), making an explicit `null` handling.

Vite was chosen as the build tool for its fast cold start and its native ESM support, which makes the development faster than webpack-based alternatives.

### No Meta-Framework

The assignment details mentioned to avoid over-scaffolding. A Vue SPA was chosen over Nuxt for this reason, this app has only two routes, no SSR requirements, and no need for file-based routing conventions. Adding Nuxt would have introduced one layer of abstraction on top.

### Layered Architecture

The codebase is organized into four explicit layers:

```text
types/        → Domain model (TVMaze API)
services/     → API calls
composables/  → Reactive state and business logic
components/   → UI components, consumes composables and props only (just renders data)
```

This separation means views/components are just data renders/viewers, they do not have any business logic. Every layer is independent and this way the service layer is tested by mocking `fetch`, then the utility functions are tested directly and components are tested with `@vue/test-utils` against the rendered output.

### Data Strategy: Batch Fetch and Client-Side Grouping

Rather than making one API request per genre (which would mean more than 8 sequential or parallel requests on every page load), the decision was to fetch 4 pages from `/shows?page=N` (approximately 1000 shows total) in a single `Promise.all` call on mount. Genre sections and the top-rated shows are derived client-side via computed properties using filter and sort utilities.

This approach eliminates N+1 request patterns, keeps the API surface minimal, and makes genre filtering and sorting faster since it operates on already-loaded data.

### Search: Debounced and Reactive

The search feature does not navigate to a separate route. Instead, making a search query switches the dashboard view from the top-rated and genre carousels to a search results view, both views are managed by reactive refs in composables. The debounce is implemented directly in `useSearch` with a plain `setTimeout` inside a Vue `watch` callback, which is more predictable under Vitest's mocked fake timers than a composable-based debounce chain.

### State Management: Pinia

Pinia is used exclusively for cross-component state that cannot live in a single composable: the favorites list and the theme toggle. Everything else (shows data, search state, detail page state) lives in composables consumed per-view, which avoids the overhead of a global store.

### Routing: Hash History

`createWebHashHistory` is used instead of `createWebHistory` to ensure the app works on static hosting (Vercel, GitHub Pages) without requiring SPA fallback rewrite rules. The tradeoff is the `#` in the URL, which I believe is acceptable for this assignment.

### Testing

Tests are organized by layer:

- **Service layer**: `fetch` is stubbed with `vi.stubGlobal` to test API success, error handling, and pagination without API calls.
- **Utility functions**: The functions are tested directly with no mocking required.
- **Composables**: Mounted inside a minimal `defineComponent` using `@vue/test-utils`, with `vi.useFakeTimers()` for the debounce behavior.
- **Components**: Rendered with `@vue/test-utils` and asserted on the DOM output.

The goal is to test the behavior, not the implementation, a test that breaks when a variable is renamed is not useful.

***

## Project Structure

```text
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── CastSection.vue
│   │   ├── GenreFilter.vue
│   │   ├── GenreTag.vue
│   │   ├── RatingBadge.vue
│   │   ├── SearchBar.vue
│   │   ├── SearchResults.vue
│   │   ├── ShowCard.vue
│   │   ├── ShowCarousel.vue
│   │   ├── ShowDetailSkeleton.vue
│   │   ├── SkeletonCard.vue
│   │   └── TopRatedGrid.vue
│   └── layout/
│       └── AppHeader.vue
├── composables/         # Reactive logic and state
│   ├── useRelatedShows.ts
│   ├── useSearch.ts
│   ├── useShowDetails.ts
│   └── useShows.ts
├── router/
│   └── index.ts
├── services/            # API layer
│   ├── tvmaze.constants.ts
│   └── tvmaze.ts
├── stores/
│   └── shows.ts
├── types/
│   └── tvmaze.ts
├── utils/
│   └── show.ts
├── views/
│   ├── ComponentsView.vue   # Test component viewer
│   ├── DashboardView.vue
│   └── ShowDetailView.vue
└── __tests__/
    ├── CastSection.test.ts
    ├── RatingBadge.test.ts
    ├── ShowCard.test.ts
    ├── showUtils.test.ts
    ├── tvmaze.test.ts
    └── useSearch.test.ts
```

***

## API Reference

All data is sourced from the [TVMaze public API](https://www.tvmaze.com/api).

| Endpoint | Usage |
| --- | --- |
| `GET /shows?page=N` | Paginated show |
| `GET /shows/:id` | Show details |
| `GET /search/shows?q=query` | Show search |
| `GET /shows/:id/cast` | Cast members of a show |

***

## Tech Stack

| Tool | Version | Purpose |
| --- | --- | --- |
| Vue | 3.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 6.x | Build tool |
| Vue Router | 4.x | Client-side routing |
| Pinia | 2.x | Global state (dark mode, favorites) |
| Tailwind CSS | 4.x | Utility-first styling |
| Vitest | 3.x | Unit testing |
| @vue/test-utils | 2.x | Component testing |
| ESLint | 9.x | Code quality |
