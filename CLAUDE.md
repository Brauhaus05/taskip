# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Taskip is a client-side-only tenant property-management prototype (rent payments, maintenance requests, messages). No backend or database — all state lives in React and persists to `localStorage`. It was converted from a static design export, `prototype.html`, which is kept at the repo root as the visual source of truth (do not edit it; reference it when reproducing a screen's look).

## Commands

- `npm run dev` — Vite dev server (open the printed URL)
- `npm test` — run the full Vitest suite once
- `npm run test:watch` — Vitest in watch mode
- `npm test -- src/store/store.test.js` — run a single test file
- `npm run build` — production build to `dist/`

CI (`.github/workflows/deploy.yml`) runs `npm ci && npm test && npm run build` on push to `main`, then deploys `dist/` to GitHub Pages at https://brauhaus05.github.io/taskip/.

## Architecture

**State** is a single `useReducer` store in `src/store/store.jsx`, exposed via `StoreProvider` / `useStore()` (`{ state, dispatch, flash }`). All mutations go through the reducer's action types (`payRent`, `submitRequest`, `cancelRequest`, `sendMessage`, `toggleAutopay`, `setToast`/`clearToast`, `reset`). To change app behavior, add or edit a reducer case — never mutate `state` directly. `flash(message)` shows a transient toast (auto-clears after 2.2s).

**Persistence** (`src/store/persistence.js`): the store `saveState`s on every state change and `loadState`s (merged over `initialState()`) on init. Storage key is `taskip:v1` — bump it if the state shape changes incompatibly. Uploaded photos are in-memory `blob:` URLs; `stripDeadPhotos` drops them before persisting since they're invalid after reload. The in-app **Reset demo data** button dispatches `reset` (restores `initialState()`).

**Seed / constants** (`src/data/seed.js`): `initialState()` returns the entire starting state tree (user, property, rent, payments, requests, threads, activity, autopay). Shared constants live here too — `CATEGORIES`, `PRIORITIES`, `AREAS`, `PAY_METHODS`, and reusable SVG `PATHS`.

**Routing** (`src/App.jsx`): `react-router-dom` with `HashRouter` (required for GitHub Pages static hosting — see `main.jsx`). Vite `base` is `/taskip/` (`vite.config.js`); keep both in sync if the repo/URL changes. `Shell` shows the bottom `TabBar` only on the four top-level tab routes (`/`, `/payments`, `/maintenance`, `/messages`).

**Multi-step flows** (e.g. `src/screens/NewRequest/`) hold a local `draft` in component state and only `dispatch` on final submit — intermediate steps are `useState`, not global store.

## Styling conventions

There is **no CSS framework** and almost no CSS file — styling is inline `style={}` objects driven by design tokens in `src/theme/tokens.js`:
- `C` — the color palette (warm greens/creams). Use these constants, not raw hex.
- `FONT`, and style factories `card()`, `primaryBtn()`, `heading(size)`, `screenPad` — reuse these instead of re-declaring common styles.
- Icons render via the shared `Icon` component fed SVG path strings (many in `PATHS`).

When building a new screen, match the existing pattern: a `jh-fade` wrapper div with `screenPad`-style padding, token colors, and the `card()`/`heading()` factories.

## Testing

Vitest + Testing Library (`jsdom`), config in `vite.config.js`, globals enabled, setup in `src/setupTests.js`. Tests co-locate next to source (`*.test.js[x]`). Reducer/persistence logic is unit-tested directly; screens are tested via React Testing Library.

## Reference docs

`docs/superpowers/` contains the original conversion spec and plan for this prototype.
