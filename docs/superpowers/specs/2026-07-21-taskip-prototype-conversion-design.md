# Taskip Prototype → Usable App — Design

**Date:** 2026-07-21
**Status:** Approved (design phase)

## Summary

Convert the existing `prototype.html` — a design-tool export that renders a tenant
property-management app inside a fake phone frame using a proprietary runtime
(`support.js` interpreting `<x-dc>`, `<sc-if>`, `<sc-for>`, and `{{ }}` bindings) —
into a real, self-contained React app. The app must:

- Run without the proprietary design-tool runtime.
- Keep the exact visual design (colors, fonts, layout).
- Make every visible control actually work (no dead-ends), all client-side.
- Remove the mobile phone frame; render as a centered app column in a normal browser.
- Use **no database** — all state is in-memory and resets on refresh.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Delivery | Vite + React project with real, split source files |
| Interaction scope | Everything tappable works — build out current dead-ends |
| Desktop layout | Centered app column (~440px), beige gutters, no phone frame |
| Persistence | In-memory only (no database, no localStorage). Resets on refresh. |
| Routing | React Router (real back/forward/refresh behavior) |

## Architecture

Standard Vite + React SPA. A single in-memory store (React Context + `useReducer`)
holds all application state. Screens read from the store and dispatch actions.
React Router maps each screen and flow step to a route so browser back/forward and
refresh behave like a real app. No backend, no database.

### Project structure

```
src/
  main.jsx            # mount + <BrowserRouter>
  App.jsx             # <Routes> + <Shell>
  theme/tokens.js     # exact colors, fonts, radii extracted from prototype.html
  store/store.jsx     # Context provider + reducer + action creators
  data/seed.js        # initial property, rent, requests, threads, history, activity
  components/
    Shell.jsx         # centered column, scroll area, mounts TabBar + Toast
    TabBar.jsx        # bottom nav (real app nav)
    Toast.jsx         # transient toast (matches jh-toast animation)
    Icon.jsx          # SVG path -> <svg> helper (replaces this.ic)
    StatusBadge.jsx   # colored status pill used in maintenance
  screens/
    Home.jsx
    Payments.jsx
    Maintenance.jsx
    Messages.jsx
    PayFlow.jsx
    PayDone.jsx
    NewRequest/
      index.jsx       # wizard container + progress bar + footer button
      Step1.jsx       # category grid
      Step2.jsx       # title / description / priority
      Step3.jsx       # photos / location / summary
    RequestDone.jsx
    MessageThread.jsx # NEW — chat view
    RequestDetail.jsx # NEW — request timeline + photos + cancel
    Receipt.jsx       # NEW — payment receipt
    PropertyInfo.jsx  # NEW — small property detail (from home strip)
```

### State shape (in-memory)

```js
{
  user:     { name, greeting },
  property: { name, unit, address },
  rent:     { amount, dueDate, nextDue, paid, confirmation, method },
  autopay:  { enabled, day },
  payments: { history: [{ id, title, date, amount, status, method }], paidYTD },
  requests: [{ id, title, cat, priority, area, desc, status, statusColor,
               statusBg, date, photos: [objectUrl], updates: [{ label, date }] }],
  threads:  [{ id, name, initials, bg, fg, time,
               messages: [{ from: 'them'|'me', text, time }] }],
  activity: [{ id, icon, title, sub, amount }],
  toast:    null | string
}
```

### Routes

```
/                     Home
/payments             Payments
/maintenance          Maintenance
/messages             Messages
/messages/:threadId   MessageThread        (NEW)
/pay                  PayFlow
/pay/done             PayDone
/requests/new         NewRequest wizard    (step held in local state)
/requests/done        RequestDone
/requests/:id         RequestDetail        (NEW)
/receipt/:paymentId   Receipt              (NEW)
/property             PropertyInfo         (NEW)
```

The bottom TabBar shows only on the four primary routes (`/`, `/payments`,
`/maintenance`, `/messages`), matching current `showTabBar` behavior.

## Interactions — what becomes real

Ported from existing behavior:

- **Tab + in-screen navigation** — now real routes with working browser back button.
- **Pay rent flow** — method select → confirm → dispatch `payRent`: sets
  `rent.paid`, appends to `payments.history` and `activity`, generates a
  confirmation number → routes to `/pay/done`.
- **New request wizard** — 3 steps; `submitRequest` prepends a new request to
  `requests` and routes to `/requests/done`.
- **Toasts** — transient messages via `toast` state + auto-clear timer.

New (previously dead) interactions:

- **Message threads** — tapping a thread routes to `/messages/:threadId` (chat
  view). Typing and sending appends a `{ from:'me' }` message to that thread's
  `messages` in state.
- **Maintenance card** — tapping routes to `/requests/:id` (detail view: status
  timeline from `updates`, category, priority, description, photos) with a
  "Cancel request" action that sets status to `Cancelled`.
- **Payment-history row** — tapping routes to `/receipt/:paymentId`.
- **Autopay** — real toggle on Payments that flips `autopay.enabled` and flashes a toast.
- **Photo picker** — Step 3 uses a real `<input type="file" accept="image/*">`;
  selected files become thumbnails via `URL.createObjectURL` (nothing uploaded).
- **Notification bell** → `/messages`. **Property strip** → `/property`.

## Styling & frame removal

- Extract the exact palette and type into `theme/tokens.js`:
  `bg #E9E4DA`, `surface #F6F3EE`, `card #fff`, `border #E7E2D8`,
  `green #40694E` / `#2E5039` / `#26402E`, `ink #1D1B16`, `mute #8A8474`,
  accents `#B07A2E` / `#B4472F` / `#6C5FA6` / `#3E7A96`; fonts
  `Bricolage Grotesque` (headings) + `Plus Jakarta Sans` (body), loaded via
  Google Fonts `<link>` in `index.html`.
- Use **CSS Modules** per component for maintainability, with tokens referenced
  as CSS custom properties. Keep visuals 1:1 with the prototype.
- **`Shell`** renders a centered column: `max-width ~440px`, `min-height 100dvh`,
  `surface` background, `bg`-colored gutters on wider viewports, full-width on
  mobile. The bottom TabBar attaches to the column bottom.
- **Removed:** phone bezel/box-shadow rings, 48px device border-radius, and the
  fake status bar (9:41 / signal / wifi / battery). `support.js` and all
  `<sc-if>`/`<sc-for>`/`{{ }}` markup are dropped.
- Keep the existing animations (`jh-fade`, `jh-toast`, `jh-pop`) as CSS.

## Testing

Vitest + React Testing Library. Cover the store reducer and the three
highest-value flows:

1. **payRent** → `rent.paid` true, history gains an entry, confirmation set.
2. **submitRequest** → new request is first in `requests` with the entered fields.
3. **sendMessage** → message appended to the correct thread with `from:'me'`.

## Out of scope

- Any backend, API, or database.
- Persistence across refresh (explicitly excluded; trivial to add later via localStorage).
- Desktop two-pane redesign (mobile-first centered column only).
- Real authentication, payments, or file upload.
```