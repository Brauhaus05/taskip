# Taskip Prototype → Usable App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `prototype.html` (a design-tool export driven by the proprietary `support.js` runtime inside a fake phone frame) into a real Vite + React app where every control works, with in-memory state, no database, and no phone frame.

**Architecture:** A Vite + React SPA. One in-memory store (React Context + `useReducer`) holds all state; screens read it and dispatch actions. React Router maps every screen/flow to a route so back/forward/refresh behave normally. State resets on refresh (no persistence). Visuals are ported 1:1 from the prototype.

**Tech Stack:** Vite, React 18, react-router-dom v6, Vitest + @testing-library/react + jsdom. Styling via inline style objects driven by a `tokens.js` module plus a small global stylesheet (fonts, reset, keyframes) — a faithful port of the prototype's inline-style approach (refines the spec's "CSS Modules" note; same visual output, lower porting risk).

**Reference:** The original export is `prototype.html` + `support.js` in the repo root. Use it as the source of truth for exact markup, colors, copy, and icon paths. Do **not** ship `support.js` or any `<x-dc>`/`<sc-if>`/`<sc-for>`/`{{ }}` markup.

---

## File Structure

```
taskip-home/
  index.html               # Vite entry; Google Fonts link; #root
  package.json             # deps + scripts
  vite.config.js           # React plugin + Vitest config
  src/
    main.jsx               # mount <BrowserRouter><StoreProvider><App/>
    App.jsx                # <Routes> inside <Shell>
    setupTests.js          # jest-dom matchers
    theme/tokens.js        # colors, fonts, shared style factories, Icon paths
    global.css             # reset, fonts wiring, keyframes (jhFade/jhToast/jhPop)
    data/seed.js           # initial state (property, rent, requests, threads, ...)
    store/store.jsx        # Context + reducer + actions + useStore hook
    store/store.test.js    # reducer/action unit tests
    components/
      Shell.jsx            # centered column, scroll area, TabBar + Toast
      TabBar.jsx           # bottom nav
      Toast.jsx            # transient toast
      Icon.jsx             # SVG path -> <svg>
      StatusBadge.jsx      # status pill
      BackHeader.jsx       # back-arrow + title row (shared by flow screens)
    screens/
      Home.jsx
      Payments.jsx
      Maintenance.jsx
      Messages.jsx
      MessageThread.jsx    # NEW
      RequestDetail.jsx    # NEW
      Receipt.jsx          # NEW
      PropertyInfo.jsx     # NEW
      PayFlow.jsx
      PayDone.jsx
      RequestDone.jsx
      NewRequest/
        index.jsx
        Step1.jsx
        Step2.jsx
        Step3.jsx
  src/App.test.jsx         # integration smoke tests
```

Original `prototype.html` and `support.js` stay in the repo as reference but are not part of the build.

---

## Task 1: Scaffold project + git

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `.gitignore`

- [ ] **Step 1: Initialize git**

Run:
```bash
cd "/Users/brauhaus/Documents/Vibe Coding Projects/taskip-home"
git init
```
Expected: `Initialized empty Git repository`.

- [ ] **Step 2: Create `.gitignore`**

```
node_modules
dist
.DS_Store
*.local
```

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "taskip",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@vitejs/plugin-react": "^4.3.1",
    "jsdom": "^24.1.1",
    "vite": "^5.4.0",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 4: Create `vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
```

- [ ] **Step 5: Create `src/setupTests.js`**

```js
import '@testing-library/jest-dom';
```

- [ ] **Step 6: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Taskip</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create placeholder `src/main.jsx`**

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

- [ ] **Step 8: Create placeholder `src/App.jsx` and `src/global.css`**

`src/App.jsx`:
```jsx
export default function App() {
  return <div>Taskip</div>;
}
```
`src/global.css`:
```css
* { box-sizing: border-box; }
```

- [ ] **Step 9: Install and verify dev server boots**

Run:
```bash
npm install
npm run build
```
Expected: install completes; `vite build` succeeds with a `dist/` output and no errors.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React project"
```

---

## Task 2: Design tokens + global stylesheet

**Files:**
- Create: `src/theme/tokens.js`, overwrite `src/global.css`

- [ ] **Step 1: Create `src/theme/tokens.js`** (exact values from `prototype.html`)

```js
export const C = {
  bg: '#E9E4DA',
  surface: '#F6F3EE',
  card: '#FFFFFF',
  border: '#E7E2D8',
  borderLight: '#F1ECE3',
  green: '#40694E',
  greenDark: '#2E5039',
  greenDarker: '#26402E',
  ink: '#1D1B16',
  sub: '#6B6656',
  mute: '#8A8474',
  mute2: '#A8A296',
  muted: '#B7B1A2',
  faint: '#B4B1A2',
  gold: '#B07A2E',
  red: '#B4472F',
  purple: '#6C5FA6',
  blue: '#3E7A96',
  greenBg: '#E8EFE8',
  goldBg: '#F6ECDB',
  purpleBg: '#EAE7F2',
  blueBg: '#E4EEF2',
  warmBg: '#F4F0E8',
  redBg: '#F6E2DC',
  neutralBg: '#EFEBE3',
};

export const FONT = {
  head: "'Bricolage Grotesque', system-ui, sans-serif",
  body: "'Plus Jakarta Sans', system-ui, sans-serif",
};

// Shared style factories (DRY) --------------------------------------------
export const card = (extra = {}) => ({
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 20,
  ...extra,
});

export const primaryBtn = (extra = {}) => ({
  width: '100%',
  background: C.green,
  color: '#fff',
  fontWeight: 700,
  fontSize: 16,
  padding: 16,
  borderRadius: 16,
  ...extra,
});

export const heading = (size, extra = {}) => ({
  fontFamily: FONT.head,
  fontSize: size,
  fontWeight: 600,
  color: C.ink,
  letterSpacing: '-.02em',
  ...extra,
});

export const screenPad = { padding: '6px 20px 28px' };
```

- [ ] **Step 2: Overwrite `src/global.css`** (reset + fonts + prototype animations)

```css
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body, #root { height: 100%; }
body {
  margin: 0;
  background: #E9E4DA;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #1D1B16;
}
a { color: #40694E; text-decoration: none; }
a:hover { color: #2E5039; }
button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
input, textarea { font-family: inherit; }
.scroll::-webkit-scrollbar { width: 0; }

.jh-fade { animation: jhFade .28s ease both; }
@keyframes jhFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.jh-toast { animation: jhToast .3s cubic-bezier(.2,.9,.3,1.2) both; }
@keyframes jhToast { from { opacity: 0; transform: translate(-50%,14px); } to { opacity: 1; transform: translate(-50%,0); } }
.jh-pop { animation: jhPop .4s cubic-bezier(.2,.9,.3,1.4) both; }
@keyframes jhPop { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: scale(1); } }
```

- [ ] **Step 3: Commit**

```bash
git add src/theme/tokens.js src/global.css
git commit -m "feat: add design tokens and global styles"
```

---

## Task 3: Seed data

**Files:**
- Create: `src/data/seed.js`

Icon paths below are copied verbatim from `prototype.html` (the `d=""` values).

- [ ] **Step 1: Create `src/data/seed.js`**

```js
import { C } from '../theme/tokens.js';

// Reusable SVG path strings from the prototype.
export const PATHS = {
  card: 'M2 5h20v14H2zM2 10h20',
  wrench:
    'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  bank: 'M3 21h18M4 10h16M5 10 12 4l7 6M6 10v11M18 10v11M10 10v11M14 10v11',
  check: 'M20 6 9 17l-5-5',
};

export const CATEGORIES = [
  { label: 'Plumbing', desc: 'Leaks, drains', bg: C.blueBg, fg: C.blue, icon: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' },
  { label: 'Electrical', desc: 'Lights, outlets', bg: C.goldBg, fg: C.gold, icon: 'M13 2 3 14h9l-1 8 10-12h-9z' },
  { label: 'Appliance', desc: 'Fridge, stove', bg: C.purpleBg, fg: C.purple, icon: 'M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z' },
  { label: 'Heating & Cooling', desc: 'AC, heat', bg: C.greenBg, fg: C.green, icon: 'M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4 4 0 1 0 5 0z' },
  { label: 'Structural', desc: 'Walls, doors', bg: C.borderLight, fg: C.sub, icon: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { label: 'Other', desc: 'Something else', bg: C.redBg, fg: C.red, icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v8M8 12h8' },
];

export const PRIORITIES = ['Low', 'Medium', 'Urgent'];
export const PRIORITY_COLOR = { Low: C.green, Medium: C.gold, Urgent: C.red };
export const AREAS = ['Kitchen', 'Bathroom', 'Bedroom', 'Living room', 'Other'];

export const PAY_METHODS = [
  { id: 'card', label: 'Visa ··4242', sub: 'Debit card', iconBg: C.greenBg, iconFg: C.green, icon: PATHS.card },
  { id: 'bank', label: 'Chase checking', sub: 'Bank ··8891', iconBg: C.purpleBg, iconFg: C.purple, icon: PATHS.bank },
];

export function initialState() {
  return {
    user: { name: 'Mara Ellison', greeting: 'Good morning' },
    property: { name: 'Maple Court', unit: 'Unit 4B', address: '128 Maple Ave' },
    rent: {
      amount: 1850,
      amountLabel: '$1,850',
      dueDate: 'Aug 1, 2026',
      nextDue: 'Sep 1, 2026',
      paid: false,
      confirmation: '#JH-4471-AUG',
      method: 'Visa ··4242',
    },
    autopay: { enabled: true, day: '1st' },
    payments: {
      paidYTD: '$12,950',
      history: [
        { id: 'p-2026-07', title: 'July Rent', date: 'Jul 1, 2026', amount: '$1,850', status: 'Paid', method: 'Visa ··4242' },
        { id: 'p-2026-06', title: 'June Rent', date: 'Jun 1, 2026', amount: '$1,850', status: 'Paid', method: 'Visa ··4242' },
        { id: 'p-2026-05', title: 'May Rent', date: 'May 1, 2026', amount: '$1,850', status: 'Paid', method: 'Visa ··4242' },
      ],
    },
    requests: [
      { id: 'r-101', title: 'Leaking kitchen faucet', cat: 'Plumbing', priority: 'Medium', area: 'Kitchen', desc: 'Water drips steadily from the base of the faucet.', status: 'In progress', statusColor: C.gold, statusBg: C.goldBg, date: 'Jul 14', photos: [], updates: [{ label: 'Submitted', date: 'Jul 14' }, { label: 'Plumber assigned', date: 'Jul 15' }] },
      { id: 'r-102', title: 'Hallway light flickering', cat: 'Electrical', priority: 'Low', area: 'Living room', desc: 'The ceiling light in the hallway flickers at night.', status: 'Scheduled', statusColor: C.green, statusBg: C.greenBg, date: 'Jul 10', photos: [], updates: [{ label: 'Submitted', date: 'Jul 10' }, { label: 'Visit scheduled Jul 22', date: 'Jul 12' }] },
      { id: 'r-103', title: 'AC not cooling well', cat: 'Heating & Cooling', priority: 'Urgent', area: 'Bedroom', desc: 'Bedroom stays warm even with AC running.', status: 'Resolved', statusColor: C.mute, statusBg: C.neutralBg, date: 'Jun 28', photos: [], updates: [{ label: 'Submitted', date: 'Jun 28' }, { label: 'Resolved', date: 'Jul 2' }] },
    ],
    threads: [
      { id: 't-1', initials: 'JR', name: 'Jordan Reyes', role: 'Property manager', time: '2h', bg: C.greenBg, fg: C.green, messages: [{ from: 'them', text: 'Hi Mara — the plumber will come Tuesday 9–11am.', time: '2h' }] },
      { id: 't-2', initials: 'MC', name: 'Maple Court', role: 'Building', time: '1d', bg: C.goldBg, fg: C.gold, messages: [{ from: 'them', text: 'Reminder: water shut-off Thursday 1–3pm.', time: '1d' }] },
      { id: 't-3', initials: 'SU', name: 'Support', role: 'Taskip', time: '3d', bg: C.purpleBg, fg: C.purple, messages: [{ from: 'them', text: 'How was your recent repair?', time: '3d' }] },
    ],
    activity: [
      { id: 'a-1', icon: PATHS.card, title: 'July rent', sub: 'Jul 1 · Visa ··4242', amount: '$1,850' },
      { id: 'a-2', icon: PATHS.wrench, title: 'Faucet repair scheduled', sub: 'Jul 15 · Plumbing', amount: '' },
      { id: 'a-3', icon: PATHS.chat, title: 'Message from Jordan', sub: 'Property manager', amount: '' },
    ],
    toast: null,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/seed.js
git commit -m "feat: add seed data"
```

---

## Task 4: Store (Context + reducer) — TDD

**Files:**
- Create: `src/store/store.jsx`, `src/store/store.test.js`

- [ ] **Step 1: Write failing tests** in `src/store/store.test.js`

```js
import { describe, it, expect } from 'vitest';
import { reducer } from './store.jsx';
import { initialState } from '../data/seed.js';

describe('reducer', () => {
  it('payRent marks rent paid, prepends history, sets confirmation', () => {
    const s0 = initialState();
    const s1 = reducer(s0, { type: 'payRent', method: 'Visa ··4242' });
    expect(s1.rent.paid).toBe(true);
    expect(s1.payments.history[0].title).toBe('August Rent');
    expect(s1.payments.history[0].status).toBe('Paid');
    expect(s1.rent.confirmation).toMatch(/^#JH-/);
    expect(s1.activity[0].title).toBe('August rent');
  });

  it('submitRequest prepends a new request with entered fields', () => {
    const s0 = initialState();
    const draft = { title: 'Broken outlet', cat: 'Electrical', priority: 'Urgent', area: 'Kitchen', desc: 'Sparks', photos: [] };
    const s1 = reducer(s0, { type: 'submitRequest', draft });
    expect(s1.requests[0].title).toBe('Broken outlet');
    expect(s1.requests[0].cat).toBe('Electrical');
    expect(s1.requests[0].status).toBe('Submitted');
    expect(s1.requests.length).toBe(s0.requests.length + 1);
  });

  it('submitRequest falls back to "<cat> issue" when title empty', () => {
    const s0 = initialState();
    const s1 = reducer(s0, { type: 'submitRequest', draft: { title: '', cat: 'Plumbing', priority: 'Low', area: 'Bathroom', desc: '', photos: [] } });
    expect(s1.requests[0].title).toBe('Plumbing issue');
  });

  it('sendMessage appends a "me" message to the right thread', () => {
    const s0 = initialState();
    const s1 = reducer(s0, { type: 'sendMessage', threadId: 't-1', text: 'Thanks!' });
    const t = s1.threads.find((x) => x.id === 't-1');
    expect(t.messages.at(-1)).toMatchObject({ from: 'me', text: 'Thanks!' });
  });

  it('toggleAutopay flips enabled', () => {
    const s0 = initialState();
    const s1 = reducer(s0, { type: 'toggleAutopay' });
    expect(s1.autopay.enabled).toBe(!s0.autopay.enabled);
  });

  it('cancelRequest sets status Cancelled', () => {
    const s0 = initialState();
    const s1 = reducer(s0, { type: 'cancelRequest', id: 'r-101' });
    expect(s1.requests.find((r) => r.id === 'r-101').status).toBe('Cancelled');
  });

  it('setToast / clearToast set and clear the message', () => {
    const s0 = initialState();
    expect(reducer(s0, { type: 'setToast', message: 'Hi' }).toast).toBe('Hi');
    expect(reducer({ ...s0, toast: 'Hi' }, { type: 'clearToast' }).toast).toBe(null);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `store.jsx` does not export `reducer` yet.

- [ ] **Step 3: Implement `src/store/store.jsx`**

```jsx
import { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { initialState, PATHS } from '../data/seed.js';
import { C } from '../theme/tokens.js';

let seq = 4470;
function nextConf() {
  seq += 1;
  return `#JH-${seq}-AUG`;
}

export function reducer(state, action) {
  switch (action.type) {
    case 'payRent': {
      const payment = {
        id: `p-2026-08`,
        title: 'August Rent',
        date: 'Aug 1, 2026',
        amount: state.rent.amountLabel,
        status: 'Paid',
        method: action.method,
      };
      const confirmation = nextConf();
      const activityEntry = {
        id: `a-${payment.id}`,
        icon: PATHS.card,
        title: 'August rent',
        sub: `Aug 1 · ${action.method}`,
        amount: state.rent.amountLabel,
      };
      return {
        ...state,
        rent: { ...state.rent, paid: true, confirmation, method: action.method },
        payments: { ...state.payments, history: [payment, ...state.payments.history] },
        activity: [activityEntry, ...state.activity],
      };
    }
    case 'submitRequest': {
      const d = action.draft;
      const req = {
        id: `r-${200 + state.requests.length}`,
        title: d.title || `${d.cat || 'Other'} issue`,
        cat: d.cat || 'Other',
        priority: d.priority,
        area: d.area,
        desc: d.desc,
        status: 'Submitted',
        statusColor: C.gold,
        statusBg: C.goldBg,
        date: 'Jul 20',
        photos: d.photos || [],
        updates: [{ label: 'Submitted', date: 'Jul 20' }],
      };
      return { ...state, requests: [req, ...state.requests] };
    }
    case 'cancelRequest':
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === action.id
            ? { ...r, status: 'Cancelled', statusColor: C.mute, statusBg: C.neutralBg }
            : r,
        ),
      };
    case 'sendMessage':
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId
            ? { ...t, time: 'now', messages: [...t.messages, { from: 'me', text: action.text, time: 'now' }] }
            : t,
        ),
      };
    case 'toggleAutopay':
      return { ...state, autopay: { ...state.autopay, enabled: !state.autopay.enabled } };
    case 'setToast':
      return { ...state, toast: action.message };
    case 'clearToast':
      return { ...state, toast: null };
    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const toastTimer = useRef(null);

  const flash = useCallback((message) => {
    dispatch({ type: 'setToast', message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => dispatch({ type: 'clearToast' }), 2200);
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch, flash }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/store/store.jsx src/store/store.test.js
git commit -m "feat: add in-memory store with reducer (TDD)"
```

---

## Task 5: Shared components (Icon, Toast, TabBar, Shell, StatusBadge, BackHeader)

**Files:**
- Create: `src/components/Icon.jsx`, `Toast.jsx`, `TabBar.jsx`, `Shell.jsx`, `StatusBadge.jsx`, `BackHeader.jsx`

- [ ] **Step 1: Create `src/components/Icon.jsx`**

```jsx
export default function Icon({ path, size = 18, stroke = 'currentColor', width = 1.9, fill = 'none', style }) {
  const paths = Array.isArray(path) ? path : [path];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/components/Toast.jsx`**

```jsx
import { useStore } from '../store/store.jsx';
import { C } from '../theme/tokens.js';

export default function Toast() {
  const { state } = useStore();
  if (!state.toast) return null;
  return (
    <div className="jh-toast" style={{
      position: 'absolute', bottom: 104, left: '50%', background: C.ink, color: '#fff',
      fontSize: 13.5, fontWeight: 500, padding: '11px 18px', borderRadius: 22, zIndex: 20,
      boxShadow: '0 8px 24px rgba(0,0,0,.25)',
    }}>{state.toast}</div>
  );
}
```

- [ ] **Step 3: Create `src/components/TabBar.jsx`**

```jsx
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import { C } from '../theme/tokens.js';

const TABS = [
  { to: '/', label: 'Home', path: ['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'] },
  { to: '/payments', label: 'Payments', path: ['M2 5h20v14H2zM2 10h20'] },
  { to: '/maintenance', label: 'Repairs', path: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'] },
  { to: '/messages', label: 'Inbox', path: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'] },
];

export default function TabBar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  return (
    <div style={{
      flex: 'none', height: 88, background: 'rgba(246,243,238,.92)', backdropFilter: 'blur(14px)',
      borderTop: `1px solid ${C.border}`, display: 'flex', padding: '10px 12px 26px', zIndex: 10,
    }}>
      {TABS.map((t) => {
        const active = t.to === '/' ? pathname === '/' : pathname.startsWith(t.to);
        return (
          <button key={t.to} onClick={() => nav(t.to)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: active ? C.green : C.mute2,
          }}>
            <Icon path={t.path} size={24} />
            <span style={{ fontSize: 10.5, fontWeight: 600 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Create `src/components/Shell.jsx`** (centered column, no phone frame)

```jsx
import { useLocation } from 'react-router-dom';
import TabBar from './TabBar.jsx';
import Toast from './Toast.jsx';
import { C } from '../theme/tokens.js';

const TAB_ROUTES = ['/', '/payments', '/maintenance', '/messages'];

export default function Shell({ children }) {
  const { pathname } = useLocation();
  const showTabBar = TAB_ROUTES.includes(pathname);
  return (
    <div style={{ minHeight: '100dvh', background: C.bg, display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: '100%', maxWidth: 440, minHeight: '100dvh', background: C.surface,
        position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        <div className="scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', paddingTop: 12 }}>
          {children}
        </div>
        {showTabBar && <TabBar />}
        <Toast />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/StatusBadge.jsx`**

```jsx
export default function StatusBadge({ label, color, bg }) {
  return (
    <span style={{
      flex: 'none', fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 20,
      background: bg, color,
    }}>{label}</span>
  );
}
```

- [ ] **Step 6: Create `src/components/BackHeader.jsx`**

```jsx
import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { C, FONT } from '../theme/tokens.js';

export default function BackHeader({ title, onBack }) {
  const nav = useNavigate();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 -6px 18px' }}>
      <button onClick={onBack || (() => nav(-1))} style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon path="m15 18-6-6 6-6" size={22} stroke={C.ink} width={2} />
      </button>
      <div style={{ fontFamily: FONT.head, fontSize: 20, fontWeight: 600, color: C.ink }}>{title}</div>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components
git commit -m "feat: add shared components and app shell (no phone frame)"
```

---

## Task 6: Wire App routes + StoreProvider + smoke test

**Files:**
- Modify: `src/main.jsx`, `src/App.jsx`
- Create: `src/App.test.jsx`

- [ ] **Step 1: Overwrite `src/main.jsx`**

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './store/store.jsx';
import App from './App.jsx';
import './global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
```

- [ ] **Step 2: Overwrite `src/App.jsx`** with all routes

```jsx
import { Routes, Route } from 'react-router-dom';
import Shell from './components/Shell.jsx';
import Home from './screens/Home.jsx';
import Payments from './screens/Payments.jsx';
import Maintenance from './screens/Maintenance.jsx';
import Messages from './screens/Messages.jsx';
import MessageThread from './screens/MessageThread.jsx';
import RequestDetail from './screens/RequestDetail.jsx';
import Receipt from './screens/Receipt.jsx';
import PropertyInfo from './screens/PropertyInfo.jsx';
import PayFlow from './screens/PayFlow.jsx';
import PayDone from './screens/PayDone.jsx';
import NewRequest from './screens/NewRequest/index.jsx';
import RequestDone from './screens/RequestDone.jsx';

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:threadId" element={<MessageThread />} />
        <Route path="/pay" element={<PayFlow />} />
        <Route path="/pay/done" element={<PayDone />} />
        <Route path="/requests/new" element={<NewRequest />} />
        <Route path="/requests/done" element={<RequestDone />} />
        <Route path="/requests/:id" element={<RequestDetail />} />
        <Route path="/receipt/:paymentId" element={<Receipt />} />
        <Route path="/property" element={<PropertyInfo />} />
      </Routes>
    </Shell>
  );
}
```

> NOTE: The screen files referenced above are created in Tasks 7–12. To keep the build green between tasks, create each screen file with a minimal stub `export default function X(){ return null; }` first if you run the dev server before those tasks. Subagent-driven execution should implement Tasks 7–12 before running `npm run build`.

- [ ] **Step 3: Create `src/App.test.jsx`** (integration smoke — home renders)

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StoreProvider } from './store/store.jsx';
import App from './App.jsx';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <StoreProvider><App /></StoreProvider>
    </MemoryRouter>,
  );
}

describe('App', () => {
  it('renders the home greeting', () => {
    renderAt('/');
    expect(screen.getByText('Mara Ellison')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run test (will fail until Home exists)**

Run: `npm test src/App.test.jsx`
Expected: FAIL until Task 7 creates `Home.jsx`. This test is completed at the end of Task 7.

- [ ] **Step 5: Commit**

```bash
git add src/main.jsx src/App.jsx src/App.test.jsx
git commit -m "feat: wire router and store provider"
```

---

## Task 7: Home screen

**Files:**
- Create: `src/screens/Home.jsx`

- [ ] **Step 1: Create `src/screens/Home.jsx`**

```jsx
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import { C, FONT, heading, screenPad, card } from '../theme/tokens.js';

export default function Home() {
  const { state } = useStore();
  const nav = useNavigate();
  const { user, property, rent, activity } = state;

  return (
    <div className="jh-fade" style={{ padding: '6px 20px 28px' }}>
      {/* greeting + bell */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 13, color: C.mute, fontWeight: 500 }}>{user.greeting}</div>
          <div style={heading(24)}>{user.name}</div>
        </div>
        <button onClick={() => nav('/messages')} style={{ width: 44, height: 44, borderRadius: 15, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Icon path={['M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9', 'M10.3 21a1.94 1.94 0 0 0 3.4 0']} size={21} stroke={C.ink} width={1.8} />
          <span style={{ position: 'absolute', top: 9, right: 11, width: 8, height: 8, borderRadius: '50%', background: C.red, border: '2px solid #fff' }} />
        </button>
      </div>

      {/* property strip -> /property */}
      <button onClick={() => nav('/property')} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, ...card({ borderRadius: 18, padding: 10, marginBottom: 16 }) }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, flex: 'none', background: 'repeating-linear-gradient(135deg,#E7E2D8,#E7E2D8 6px,#EFEAE1 6px,#EFEAE1 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon path={['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10']} size={22} stroke={C.mute} width={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: C.ink }}>{property.name}</div>
          <div style={{ fontSize: 13, color: C.mute }}>{property.unit} · {property.address}</div>
        </div>
        <Icon path="m9 18 6-6-6-6" size={20} stroke={C.muted} width={2} />
      </button>

      {/* rent card */}
      {rent.paid ? (
        <div style={{ background: C.green, borderRadius: 24, padding: 22, color: '#fff', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, opacity: .9, marginBottom: 6 }}>
            <Icon path="M20 6 9 17l-5-5" size={18} stroke="#fff" width={2.4} /> You're all paid up
          </div>
          <div style={{ fontFamily: FONT.head, fontSize: 30, fontWeight: 600, letterSpacing: '-.02em' }}>August rent settled</div>
          <div style={{ fontSize: 13, opacity: .8, marginTop: 4 }}>Next payment due {rent.nextDue}</div>
        </div>
      ) : (
        <div style={{ background: C.green, borderRadius: 24, padding: 22, color: '#fff', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
          <div style={{ fontSize: 13, fontWeight: 500, opacity: .85 }}>Rent due · {rent.dueDate}</div>
          <div style={{ fontFamily: FONT.head, fontSize: 40, fontWeight: 600, letterSpacing: '-.02em', margin: '2px 0' }}>{rent.amountLabel}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, opacity: .8, marginBottom: 16 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E7C87A' }} /> Due in 12 days
          </div>
          <button onClick={() => nav('/pay')} style={{ width: '100%', background: '#fff', color: C.greenDarker, fontWeight: 700, fontSize: 15, padding: 13, borderRadius: 14 }}>Pay now</button>
        </div>
      )}

      {/* quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
        <button onClick={() => nav('/pay')} style={{ textAlign: 'left', ...card({ borderRadius: 18, padding: 16 }) }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Icon path={['M2 5h20v14H2zM2 10h20']} size={20} stroke={C.green} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>Pay rent</div>
          <div style={{ fontSize: 12, color: C.mute }}>Card or bank</div>
        </button>
        <button onClick={() => nav('/requests/new')} style={{ textAlign: 'left', ...card({ borderRadius: 18, padding: 16 }) }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.goldBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Icon path="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" size={20} stroke={C.gold} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>New request</div>
          <div style={{ fontSize: 12, color: C.mute }}>Report an issue</div>
        </button>
      </div>

      {/* recent activity */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ ...heading(17) }}>Recent activity</div>
        <span style={{ fontSize: 13, color: C.mute, fontWeight: 500 }}>This month</span>
      </div>
      <div style={{ ...card({ overflow: 'hidden' }) }}>
        {activity.map((a) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', background: C.warmBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub }}>
              <Icon path={a.icon} size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{a.title}</div>
              <div style={{ fontSize: 12, color: C.mute }}>{a.sub}</div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{a.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run the smoke test from Task 6**

Run: `npm test src/App.test.jsx`
Expected: PASS — "Mara Ellison" is found.

- [ ] **Step 3: Commit**

```bash
git add src/screens/Home.jsx
git commit -m "feat: home screen"
```

---

## Task 8: Payments screen (+ working autopay toggle)

**Files:**
- Create: `src/screens/Payments.jsx`

- [ ] **Step 1: Create `src/screens/Payments.jsx`**

```jsx
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import { C, heading, card } from '../theme/tokens.js';

export default function Payments() {
  const { state, dispatch, flash } = useStore();
  const nav = useNavigate();
  const { rent, autopay, payments } = state;

  const balanceLabel = rent.paid ? '$0.00' : '$1,850.00';
  const balanceSub = rent.paid ? `Next due ${rent.nextDue}` : `Due ${rent.dueDate}`;
  const payLabel = rent.paid ? 'View receipt' : 'Pay $1,850 now';
  const onPay = rent.paid
    ? () => flash(`Receipt ${rent.confirmation}`)
    : () => nav('/pay');

  const toggleAutopay = () => {
    dispatch({ type: 'toggleAutopay' });
    flash(autopay.enabled ? 'Autopay turned off' : 'Autopay turned on');
  };

  return (
    <div className="jh-fade" style={{ padding: '6px 20px 28px' }}>
      <div style={{ ...heading(26), marginBottom: 18 }}>Payments</div>

      <div style={{ ...card({ borderRadius: 24, padding: 22, marginBottom: 16, textAlign: 'center' }) }}>
        <div style={{ fontSize: 13, color: C.mute, fontWeight: 500 }}>Current balance</div>
        <div style={{ ...heading(44, { letterSpacing: '-.03em', margin: '2px 0 4px' }) }}>{balanceLabel}</div>
        <div style={{ fontSize: 13, color: C.mute, marginBottom: 18 }}>{balanceSub}</div>
        <button onClick={onPay} style={{ width: '100%', background: C.green, color: '#fff', fontWeight: 700, fontSize: 15, padding: 14, borderRadius: 14 }}>{payLabel}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <button onClick={toggleAutopay} style={{ textAlign: 'left', ...card({ borderRadius: 18, padding: 15 }) }}>
          <div style={{ fontSize: 12, color: C.mute, fontWeight: 500 }}>Autopay</div>
          <div style={{ fontWeight: 600, fontSize: 15, color: autopay.enabled ? C.green : C.mute, marginTop: 2 }}>
            {autopay.enabled ? `On · ${autopay.day}` : 'Off'}
          </div>
        </button>
        <div style={{ ...card({ borderRadius: 18, padding: 15 }) }}>
          <div style={{ fontSize: 12, color: C.mute, fontWeight: 500 }}>Paid in 2026</div>
          <div style={{ fontWeight: 600, fontSize: 15, color: C.ink, marginTop: 2 }}>{payments.paidYTD}</div>
        </div>
      </div>

      <div style={{ ...heading(17), marginBottom: 12 }}>Payment history</div>
      <div style={{ ...card({ overflow: 'hidden' }) }}>
        {payments.history.map((h) => (
          <button key={h.id} onClick={() => nav(`/receipt/${h.id}`)} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 13, padding: '15px 16px', borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon path="M20 6 9 17l-5-5" size={17} stroke={C.green} width={2.4} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{h.title}</div>
              <div style={{ fontSize: 12, color: C.mute }}>{h.date}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{h.amount}</div>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>{h.status}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/Payments.jsx
git commit -m "feat: payments screen with autopay toggle"
```

---

## Task 9: Maintenance screen

**Files:**
- Create: `src/screens/Maintenance.jsx`

- [ ] **Step 1: Create `src/screens/Maintenance.jsx`**

```jsx
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { C, FONT, heading, card } from '../theme/tokens.js';

export default function Maintenance() {
  const { state } = useStore();
  const nav = useNavigate();
  const reqs = state.requests;

  const count = (pred) => reqs.filter(pred).length;
  const openN = count((r) => ['Submitted', 'In progress'].includes(r.status));
  const schedN = count((r) => r.status === 'Scheduled');
  const doneN = count((r) => ['Resolved', 'Cancelled'].includes(r.status));

  const Stat = ({ n, label, color }) => (
    <div style={{ flex: 1, ...card({ borderRadius: 16, padding: 14 }) }}>
      <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color }}>{n}</div>
      <div style={{ fontSize: 12, color: C.mute, fontWeight: 500 }}>{label}</div>
    </div>
  );

  return (
    <div className="jh-fade" style={{ padding: '6px 20px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={heading(26)}>Maintenance</div>
        <button onClick={() => nav('/requests/new')} style={{ width: 42, height: 42, borderRadius: 14, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon path="M12 5v14M5 12h14" size={22} stroke="#fff" width={2.4} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <Stat n={openN} label="Open" color={C.gold} />
        <Stat n={schedN} label="Scheduled" color={C.green} />
        <Stat n={doneN} label="Resolved" color={C.mute} />
      </div>

      <div style={{ ...heading(17), marginBottom: 12 }}>Your requests</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reqs.map((r) => (
          <button key={r.id} onClick={() => nav(`/requests/${r.id}`)} style={{ width: '100%', textAlign: 'left', ...card({ borderRadius: 18, padding: 16 }) }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: C.ink, lineHeight: 1.3 }}>{r.title}</div>
              <StatusBadge label={r.status} color={r.statusColor} bg={r.statusBg} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: C.mute }}>
              <span>{r.cat}</span><span style={{ opacity: .4 }}>·</span><span>{r.date}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/Maintenance.jsx
git commit -m "feat: maintenance list screen"
```

---

## Task 10: Messages list + Message thread (chat) — TDD on send

**Files:**
- Create: `src/screens/Messages.jsx`, `src/screens/MessageThread.jsx`, `src/screens/MessageThread.test.jsx`

- [ ] **Step 1: Create `src/screens/Messages.jsx`**

```jsx
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import { C, heading, card } from '../theme/tokens.js';

export default function Messages() {
  const { state } = useStore();
  const nav = useNavigate();
  return (
    <div className="jh-fade" style={{ padding: '6px 20px 28px' }}>
      <div style={{ ...heading(26), marginBottom: 18 }}>Messages</div>
      <div style={{ ...card({ overflow: 'hidden' }) }}>
        {state.threads.map((t) => {
          const last = t.messages.at(-1);
          return (
            <button key={t.id} onClick={() => nav(`/messages/${t.id}`)} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 13, padding: '15px 16px', borderTop: `1px solid ${C.borderLight}` }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', flex: 'none', background: t.bg, color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>{t.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{t.time}</div>
                </div>
                <div style={{ fontSize: 12.5, color: C.mute, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{last?.text}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write failing test** `src/screens/MessageThread.test.jsx`

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '../store/store.jsx';
import MessageThread from './MessageThread.jsx';

function renderThread() {
  return render(
    <MemoryRouter initialEntries={['/messages/t-1']}>
      <StoreProvider>
        <Routes><Route path="/messages/:threadId" element={<MessageThread />} /></Routes>
      </StoreProvider>
    </MemoryRouter>,
  );
}

describe('MessageThread', () => {
  it('shows the seeded message and appends a sent message', async () => {
    const user = userEvent.setup();
    renderThread();
    expect(screen.getByText(/plumber will come Tuesday/i)).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText(/message/i), 'On my way');
    await user.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.getByText('On my way')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test src/screens/MessageThread.test.jsx`
Expected: FAIL — `MessageThread.jsx` not found.

- [ ] **Step 4: Create `src/screens/MessageThread.jsx`**

```jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import BackHeader from '../components/BackHeader.jsx';
import { C } from '../theme/tokens.js';

export default function MessageThread() {
  const { threadId } = useParams();
  const { state, dispatch } = useStore();
  const [text, setText] = useState('');
  const thread = state.threads.find((t) => t.id === threadId);

  if (!thread) return <div style={{ padding: 20 }}>Conversation not found.</div>;

  const send = () => {
    const v = text.trim();
    if (!v) return;
    dispatch({ type: 'sendMessage', threadId, text: v });
    setText('');
  };

  return (
    <div className="jh-fade" style={{ padding: '2px 20px 20px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - 12px)' }}>
      <BackHeader title={thread.name} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 12 }}>
        {thread.messages.map((m, i) => {
          const mine = m.from === 'me';
          return (
            <div key={i} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '78%', background: mine ? C.green : '#fff', color: mine ? '#fff' : C.ink, border: mine ? 'none' : `1px solid ${C.border}`, borderRadius: 16, padding: '10px 13px', fontSize: 14, lineHeight: 1.4 }}>
              {m.text}
              <div style={{ fontSize: 10.5, opacity: .6, marginTop: 4, textAlign: 'right' }}>{m.time}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingTop: 8 }}>
        <input value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Message"
          style={{ flex: 1, background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 22, padding: '12px 15px', fontSize: 14, color: C.ink, outline: 'none' }} />
        <button aria-label="Send" onClick={send} style={{ width: 44, height: 44, borderRadius: '50%', flex: 'none', background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon path={['M22 2 11 13', 'M22 2 15 22l-4-9-9-4z']} size={20} stroke="#fff" width={2} />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test src/screens/MessageThread.test.jsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/screens/Messages.jsx src/screens/MessageThread.jsx src/screens/MessageThread.test.jsx
git commit -m "feat: messages list and working chat thread"
```

---

## Task 11: Pay flow + Pay done + Receipt

**Files:**
- Create: `src/screens/PayFlow.jsx`, `src/screens/PayDone.jsx`, `src/screens/Receipt.jsx`

- [ ] **Step 1: Create `src/screens/PayFlow.jsx`**

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import BackHeader from '../components/BackHeader.jsx';
import { PAY_METHODS } from '../data/seed.js';
import { C, FONT, primaryBtn } from '../theme/tokens.js';

export default function PayFlow() {
  const { state, dispatch } = useStore();
  const nav = useNavigate();
  const [method, setMethod] = useState('card');

  const confirm = () => {
    const label = PAY_METHODS.find((m) => m.id === method).label;
    dispatch({ type: 'payRent', method: label });
    nav('/pay/done');
  };

  const Row = ({ label, value, bold, border }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: bold ? 15 : 13.5, fontWeight: bold ? 700 : 400, color: bold ? C.ink : C.sub, paddingTop: border ? 10 : 0, paddingBottom: border === 'mid' ? 10 : 0, borderBottom: border === 'mid' ? `1px solid ${C.borderLight}` : 'none', marginBottom: border === 'mid' ? 0 : 8 }}>
      <span>{label}</span><span style={{ color: C.ink, fontWeight: bold ? 700 : 500 }}>{value}</span>
    </div>
  );

  return (
    <div className="jh-fade" style={{ padding: '2px 20px 40px' }}>
      <BackHeader title="Pay rent" onBack={() => nav('/')} />
      <div style={{ textAlign: 'center', padding: '18px 0 22px' }}>
        <div style={{ fontSize: 13, color: C.mute, fontWeight: 500 }}>Amount due · Aug 1</div>
        <div style={{ fontFamily: FONT.head, fontSize: 52, fontWeight: 600, color: C.ink, letterSpacing: '-.03em' }}>{state.rent.amountLabel}</div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: C.mute, marginBottom: 10 }}>Payment method</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {PAY_METHODS.map((m) => {
          const sel = method === m.id;
          return (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 13, background: '#fff', border: `1.5px solid ${sel ? C.green : C.border}`, borderRadius: 16, padding: '14px 15px', textAlign: 'left' }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, flex: 'none', background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon path={m.icon} size={20} stroke={m.iconFg} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{m.label}</div>
                <div style={{ fontSize: 12, color: C.mute }}>{m.sub}</div>
              </div>
              {sel ? (
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon path="M20 6 9 17l-5-5" size={13} stroke="#fff" width={3} />
                </div>
              ) : (
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #E0DACE' }} />
              )}
            </button>
          );
        })}
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 15, marginBottom: 22 }}>
        <Row label="Rent" value="$1,850.00" />
        <Row label="Processing fee" value="$0.00" border="mid" />
        <Row label="Total" value="$1,850.00" bold border />
      </div>
      <button onClick={confirm} style={primaryBtn()}>Confirm payment</button>
      <div style={{ textAlign: 'center', fontSize: 12, color: C.muted, marginTop: 12 }}>Secured · payment processed instantly</div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/screens/PayDone.jsx`**

```jsx
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import { C, FONT, primaryBtn } from '../theme/tokens.js';

export default function PayDone() {
  const { state } = useStore();
  const nav = useNavigate();
  const { rent } = state;
  return (
    <div className="jh-fade" style={{ padding: '80px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: 640, justifyContent: 'center' }}>
      <div className="jh-pop" style={{ width: 88, height: 88, borderRadius: '50%', background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Icon path="M20 6 9 17l-5-5" size={42} stroke="#fff" width={2.6} />
      </div>
      <div style={{ fontFamily: FONT.head, fontSize: 28, fontWeight: 600, color: C.ink, letterSpacing: '-.02em' }}>Payment sent</div>
      <div style={{ fontSize: 14.5, color: C.mute, margin: '8px 0 26px', lineHeight: 1.5 }}>
        {rent.amountLabel} for August rent was paid<br />to {state.property.name} · {state.property.unit}
      </div>
      <div style={{ width: '100%', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 26, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: C.sub, marginBottom: 9 }}><span>Confirmation</span><span style={{ color: C.ink, fontWeight: 600 }}>{rent.confirmation}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: C.sub }}><span>Method</span><span style={{ color: C.ink, fontWeight: 600 }}>{rent.method}</span></div>
      </div>
      <button onClick={() => nav('/')} style={primaryBtn()}>Back to home</button>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/screens/Receipt.jsx`**

```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import BackHeader from '../components/BackHeader.jsx';
import { C, FONT, primaryBtn } from '../theme/tokens.js';

export default function Receipt() {
  const { paymentId } = useParams();
  const { state } = useStore();
  const nav = useNavigate();
  const p = state.payments.history.find((x) => x.id === paymentId);

  if (!p) return <div style={{ padding: 20 }}><BackHeader title="Receipt" />Receipt not found.</div>;

  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: C.sub, marginBottom: 12 }}>
      <span>{label}</span><span style={{ color: C.ink, fontWeight: 600 }}>{value}</span>
    </div>
  );

  return (
    <div className="jh-fade" style={{ padding: '2px 20px 40px' }}>
      <BackHeader title="Receipt" />
      <div style={{ textAlign: 'center', padding: '10px 0 22px' }}>
        <div className="jh-pop" style={{ width: 72, height: 72, borderRadius: '50%', background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Icon path="M20 6 9 17l-5-5" size={34} stroke={C.green} width={2.6} />
        </div>
        <div style={{ fontFamily: FONT.head, fontSize: 34, fontWeight: 600, color: C.ink, letterSpacing: '-.02em' }}>{p.amount}</div>
        <div style={{ fontSize: 13, color: C.mute, marginTop: 2 }}>{p.title} · {p.status}</div>
      </div>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
        <Row label="Date" value={p.date} />
        <Row label="Method" value={p.method} />
        <Row label="Property" value={`${state.property.name} · ${state.property.unit}`} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: C.sub }}>
          <span>Confirmation</span><span style={{ color: C.ink, fontWeight: 600 }}>{state.rent.confirmation}</span>
        </div>
      </div>
      <div style={{ marginTop: 22 }}>
        <button onClick={() => nav('/payments')} style={primaryBtn()}>Done</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Manual verify pay flow**

Run: `npm run dev`, open the local URL. On Home tap **Pay now** → **Confirm payment** → see "Payment sent" → **Back to home** → rent card now shows "August rent settled". On Payments, tap a history row → receipt renders.

- [ ] **Step 5: Commit**

```bash
git add src/screens/PayFlow.jsx src/screens/PayDone.jsx src/screens/Receipt.jsx
git commit -m "feat: pay flow, confirmation, and receipt"
```

---

## Task 12: New request wizard (3 steps, real photo picker) + Request done — TDD on submit

**Files:**
- Create: `src/screens/NewRequest/index.jsx`, `Step1.jsx`, `Step2.jsx`, `Step3.jsx`, `src/screens/RequestDone.jsx`, `src/screens/NewRequest/NewRequest.test.jsx`

- [ ] **Step 1: Create `src/screens/NewRequest/Step1.jsx`**

```jsx
import Icon from '../../components/Icon.jsx';
import { CATEGORIES } from '../../data/seed.js';
import { C, FONT } from '../../theme/tokens.js';

export default function Step1({ onPick }) {
  return (
    <div className="jh-fade">
      <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: '-.02em', marginBottom: 4 }}>What needs fixing?</div>
      <div style={{ fontSize: 14, color: C.mute, marginBottom: 20 }}>Pick the closest category</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {CATEGORIES.map((c) => (
          <button key={c.label} onClick={() => onPick(c.label)} style={{ textAlign: 'left', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '16px 15px' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 11 }}>
              <Icon path={c.icon} size={21} stroke={c.fg} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{c.label}</div>
            <div style={{ fontSize: 11.5, color: C.mute, marginTop: 1 }}>{c.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/screens/NewRequest/Step2.jsx`**

```jsx
import { PRIORITIES, PRIORITY_COLOR } from '../../data/seed.js';
import { C, FONT } from '../../theme/tokens.js';

export default function Step2({ draft, set }) {
  return (
    <div className="jh-fade">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: C.warmBg, borderRadius: 20, padding: '6px 12px', fontSize: 12.5, fontWeight: 600, color: C.sub, marginBottom: 16 }}>{draft.cat}</div>
      <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: '-.02em', marginBottom: 16 }}>Tell us more</div>

      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 7 }}>Title</div>
      <input value={draft.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Leaking faucet under sink"
        style={{ width: '100%', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 14, fontSize: 14, color: C.ink, outline: 'none', marginBottom: 16 }} />

      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 7 }}>Description</div>
      <textarea value={draft.desc} onChange={(e) => set({ desc: e.target.value })} placeholder="What's happening? When did it start?" rows={4}
        style={{ width: '100%', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 14, fontSize: 14, color: C.ink, outline: 'none', resize: 'none', marginBottom: 18 }} />

      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 9 }}>Priority</div>
      <div style={{ display: 'flex', gap: 9 }}>
        {PRIORITIES.map((p) => {
          const on = draft.priority === p;
          return (
            <button key={p} onClick={() => set({ priority: p })} style={{ flex: 1, padding: 11, borderRadius: 13, fontSize: 13.5, fontWeight: 600, border: `1.5px solid ${on ? PRIORITY_COLOR[p] : C.border}`, background: '#fff', color: on ? PRIORITY_COLOR[p] : C.mute }}>{p}</button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/screens/NewRequest/Step3.jsx`** (real photo picker)

```jsx
import { useRef } from 'react';
import Icon from '../../components/Icon.jsx';
import { AREAS } from '../../data/seed.js';
import { C, FONT } from '../../theme/tokens.js';

export default function Step3({ draft, set }) {
  const fileRef = useRef(null);

  const onFiles = (e) => {
    const urls = Array.from(e.target.files || []).map((f) => URL.createObjectURL(f));
    if (urls.length) set({ photos: [...draft.photos, ...urls] });
  };

  return (
    <div className="jh-fade">
      <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: '-.02em', marginBottom: 16 }}>Photos & location</div>

      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 9 }}>Add photos <span style={{ color: C.muted, fontWeight: 500 }}>(optional)</span></div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} style={{ display: 'none' }} />
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => fileRef.current?.click()} style={{ width: 78, height: 78, borderRadius: 14, border: `1.5px dashed ${C.muted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBF9F5' }}>
          <Icon path={['M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z', 'M12 13m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0']} size={24} stroke={C.mute2} width={1.8} />
        </button>
        {draft.photos.map((src, i) => (
          <div key={i} style={{ width: 78, height: 78, borderRadius: 14, backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', border: `1px solid ${C.border}` }} />
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 9 }}>Where in the unit?</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: 22 }}>
        {AREAS.map((a) => {
          const on = draft.area === a;
          return (
            <button key={a} onClick={() => set({ area: a })} style={{ padding: '9px 15px', borderRadius: 20, fontSize: 13, fontWeight: 600, border: `1.5px solid ${on ? C.green : C.border}`, background: on ? C.green : '#fff', color: on ? '#fff' : C.sub }}>{a}</button>
          );
        })}
      </div>

      <div style={{ background: C.warmBg, borderRadius: 16, padding: 15, marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.mute, marginBottom: 8 }}>Summary</div>
        <div style={{ fontSize: 14, color: C.ink, fontWeight: 600, marginBottom: 3 }}>{draft.title || 'Untitled request'}</div>
        <div style={{ fontSize: 12.5, color: C.sub }}>{draft.cat} · {draft.priority} priority · {draft.area}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/screens/NewRequest/index.jsx`** (wizard container)

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store.jsx';
import BackHeader from '../../components/BackHeader.jsx';
import Step1 from './Step1.jsx';
import Step2 from './Step2.jsx';
import Step3 from './Step3.jsx';
import { C, primaryBtn } from '../../theme/tokens.js';

const EMPTY = { cat: '', title: '', desc: '', priority: 'Medium', area: 'Kitchen', photos: [] };

export default function NewRequest() {
  const { dispatch } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(EMPTY);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const bar = (n) => ({ flex: 1, height: 5, borderRadius: 3, background: step >= n ? C.green : '#E0DACE' });

  const back = () => (step > 1 ? setStep(step - 1) : nav('/maintenance'));
  const pickCat = (cat) => { set({ cat }); setStep(2); };
  const submit = () => { dispatch({ type: 'submitRequest', draft }); nav('/requests/done'); };

  return (
    <div className="jh-fade" style={{ padding: '2px 20px 40px' }}>
      <BackHeader title="New request" onBack={back} />
      <div style={{ display: 'flex', gap: 6, padding: '6px 2px 22px' }}>
        <div style={bar(1)} /><div style={bar(2)} /><div style={bar(3)} />
      </div>

      {step === 1 && <Step1 onPick={pickCat} />}
      {step === 2 && <Step2 draft={draft} set={set} />}
      {step === 3 && <Step3 draft={draft} set={set} />}

      <div style={{ marginTop: 24 }}>
        {step === 2 && <button onClick={() => setStep(3)} style={primaryBtn()}>Continue</button>}
        {step === 3 && <button onClick={submit} style={primaryBtn()}>Submit request</button>}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/screens/RequestDone.jsx`**

```jsx
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import { C, FONT, primaryBtn } from '../theme/tokens.js';

export default function RequestDone() {
  const { state } = useStore();
  const nav = useNavigate();
  const ticket = state.requests[0]?.id?.replace('r-', '#MR-') || '#MR-2049';
  return (
    <div className="jh-fade" style={{ padding: '80px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: 640, justifyContent: 'center' }}>
      <div className="jh-pop" style={{ width: 88, height: 88, borderRadius: '50%', background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Icon path="M20 6 9 17l-5-5" size={42} stroke="#fff" width={2.6} />
      </div>
      <div style={{ fontFamily: FONT.head, fontSize: 28, fontWeight: 600, color: C.ink, letterSpacing: '-.02em' }}>Request submitted</div>
      <div style={{ fontSize: 14.5, color: C.mute, margin: '8px 0 26px', lineHeight: 1.5 }}>Your property manager has been notified.<br />You'll get updates here and by email.</div>
      <div style={{ width: '100%', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 26, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: C.sub, marginBottom: 9 }}><span>Ticket</span><span style={{ color: C.ink, fontWeight: 600 }}>{ticket}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: C.sub }}><span>Typical response</span><span style={{ color: C.ink, fontWeight: 600 }}>Within 24 hrs</span></div>
      </div>
      <button onClick={() => nav('/maintenance')} style={primaryBtn()}>View my requests</button>
    </div>
  );
}
```

- [ ] **Step 6: Write failing test** `src/screens/NewRequest/NewRequest.test.jsx`

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '../../store/store.jsx';
import NewRequest from './index.jsx';
import Maintenance from '../Maintenance.jsx';
import RequestDone from '../RequestDone.jsx';

function renderWizard() {
  return render(
    <MemoryRouter initialEntries={['/requests/new']}>
      <StoreProvider>
        <Routes>
          <Route path="/requests/new" element={<NewRequest />} />
          <Route path="/requests/done" element={<RequestDone />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Routes>
      </StoreProvider>
    </MemoryRouter>,
  );
}

describe('NewRequest wizard', () => {
  it('creates a request that appears in the maintenance list', async () => {
    const user = userEvent.setup();
    renderWizard();
    await user.click(screen.getByText('Plumbing'));               // step 1
    await user.type(screen.getByPlaceholderText(/Leaking faucet/i), 'Clogged drain');
    await user.click(screen.getByRole('button', { name: 'Continue' })); // -> step 3
    await user.click(screen.getByRole('button', { name: 'Submit request' }));
    expect(screen.getByText('Request submitted')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'View my requests' }));
    expect(screen.getByText('Clogged drain')).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test src/screens/NewRequest/NewRequest.test.jsx`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/screens/NewRequest src/screens/RequestDone.jsx
git commit -m "feat: new-request wizard with photo picker and submit"
```

---

## Task 13: Request detail + Property info

**Files:**
- Create: `src/screens/RequestDetail.jsx`, `src/screens/PropertyInfo.jsx`

- [ ] **Step 1: Create `src/screens/RequestDetail.jsx`**

```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import BackHeader from '../components/BackHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { C, FONT } from '../theme/tokens.js';

export default function RequestDetail() {
  const { id } = useParams();
  const { state, dispatch, flash } = useStore();
  const nav = useNavigate();
  const r = state.requests.find((x) => x.id === id);

  if (!r) return <div style={{ padding: 20 }}><BackHeader title="Request" />Request not found.</div>;

  const closed = ['Resolved', 'Cancelled'].includes(r.status);
  const cancel = () => { dispatch({ type: 'cancelRequest', id: r.id }); flash('Request cancelled'); };

  return (
    <div className="jh-fade" style={{ padding: '2px 20px 40px' }}>
      <BackHeader title="Request" />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
        <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: '-.02em', lineHeight: 1.25 }}>{r.title}</div>
        <StatusBadge label={r.status} color={r.statusColor} bg={r.statusBg} />
      </div>
      <div style={{ fontSize: 13, color: C.mute, marginBottom: 18 }}>{r.cat} · {r.priority} priority · {r.area}</div>

      {r.desc && (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 15, marginBottom: 18, fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{r.desc}</div>
      )}

      {r.photos.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          {r.photos.map((src, i) => (
            <div key={i} style={{ width: 78, height: 78, borderRadius: 14, backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', border: `1px solid ${C.border}` }} />
          ))}
        </div>
      )}

      <div style={{ fontFamily: FONT.head, fontSize: 17, fontWeight: 600, color: C.ink, marginBottom: 12 }}>Timeline</div>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '6px 16px', marginBottom: 22 }}>
        {r.updates.map((u, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderTop: i ? `1px solid ${C.borderLight}` : 'none' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', flex: 'none', background: C.green }} />
            <div style={{ flex: 1, fontSize: 14, color: C.ink, fontWeight: 500 }}>{u.label}</div>
            <div style={{ fontSize: 12, color: C.mute }}>{u.date}</div>
          </div>
        ))}
      </div>

      {!closed && (
        <button onClick={cancel} style={{ width: '100%', background: '#fff', color: C.red, fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 16, border: `1.5px solid ${C.border}` }}>Cancel request</button>
      )}
      <div style={{ marginTop: 12 }}>
        <button onClick={() => nav('/maintenance')} style={{ width: '100%', color: C.mute, fontWeight: 600, fontSize: 14, padding: 8 }}>Back to all requests</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/screens/PropertyInfo.jsx`**

```jsx
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import BackHeader from '../components/BackHeader.jsx';
import { C, FONT } from '../theme/tokens.js';

export default function PropertyInfo() {
  const { state } = useStore();
  const nav = useNavigate();
  const { property } = state;

  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: C.sub, padding: '12px 0', borderTop: `1px solid ${C.borderLight}` }}>
      <span>{label}</span><span style={{ color: C.ink, fontWeight: 600 }}>{value}</span>
    </div>
  );

  return (
    <div className="jh-fade" style={{ padding: '2px 20px 40px' }}>
      <BackHeader title="Property" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, flex: 'none', background: 'repeating-linear-gradient(135deg,#E7E2D8,#E7E2D8 6px,#EFEAE1 6px,#EFEAE1 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon path={['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10']} size={26} stroke={C.mute} width={1.8} />
        </div>
        <div>
          <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color: C.ink }}>{property.name}</div>
          <div style={{ fontSize: 13.5, color: C.mute }}>{property.unit}</div>
        </div>
      </div>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '0 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: C.sub, padding: '12px 0' }}>
          <span>Address</span><span style={{ color: C.ink, fontWeight: 600 }}>{property.address}</span>
        </div>
        <Row label="Unit" value={property.unit} />
        <Row label="Lease" value="Through Dec 2026" />
        <Row label="Manager" value="Jordan Reyes" />
      </div>
      <button onClick={() => nav('/messages/t-1')} style={{ width: '100%', background: C.green, color: '#fff', fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 16 }}>Message property manager</button>
    </div>
  );
}
```

- [ ] **Step 3: Run full test suite + build**

Run: `npm test && npm run build`
Expected: all test files PASS; `vite build` succeeds with no errors.

- [ ] **Step 4: Manual verify remaining flows**

Run: `npm run dev`. Verify: Maintenance card → detail with timeline; Cancel request → status becomes "Cancelled" + toast; Home property strip → Property screen → "Message property manager" opens Jordan's thread.

- [ ] **Step 5: Commit**

```bash
git add src/screens/RequestDetail.jsx src/screens/PropertyInfo.jsx
git commit -m "feat: request detail and property info screens"
```

---

## Task 14: Final polish + README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# Taskip

A tenant property-management prototype (rent, maintenance, messages). Fully
client-side — no backend, no database. State resets on refresh.

## Run
- `npm install`
- `npm run dev` — open the printed local URL
- `npm test` — run the test suite
- `npm run build` — production build

Converted from the original `prototype.html` design export (kept in the repo for reference).
```

- [ ] **Step 2: Confirm the reference export is untouched and not imported**

Run: `grep -R "support.js\|x-dc\|sc-if" src` 
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README"
```

---

## Self-Review Notes (traceability)

- **No phone frame / centered column** → Task 5 `Shell.jsx` (maxWidth 440, no bezel/status bar).
- **No proprietary runtime** → `support.js` and `<sc-*>` never imported; verified in Task 14 Step 2.
- **In-memory, no DB, resets on refresh** → Task 4 store uses `useReducer` only; no persistence.
- **Every interaction works** — nav (Task 5/6), pay flow (11), request wizard + photo picker (12), message threads (10), maintenance detail + cancel (13), payment receipt (11), autopay toggle (8), property strip (13), notification bell (7).
- **Visual fidelity** → tokens (Task 2) + per-screen ports (7–13) use exact prototype colors/copy/icon paths from `data/seed.js` (Task 3).
- **Tests** → reducer (Task 4), send message (10), submit request (12), home smoke (6), full suite + build (13).
- **Type consistency** → action types (`payRent`, `submitRequest`, `cancelRequest`, `sendMessage`, `toggleAutopay`, `setToast`, `clearToast`) defined in Task 4 are the exact strings dispatched in Tasks 8–13; `draft` shape (`cat,title,desc,priority,area,photos`) is consistent between Task 12 wizard and Task 4 `submitRequest`.
```