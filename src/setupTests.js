import '@testing-library/jest-dom';

// The test runtime (Node 25 / jsdom) exposes an inconsistent ambient
// localStorage (getItem/setItem exist, removeItem/clear may not). Install a
// deterministic in-memory Storage so persistence behaves predictably in tests.
const __store = new Map();
const localStorageMock = {
  getItem: (k) => (__store.has(String(k)) ? __store.get(String(k)) : null),
  setItem: (k, v) => { __store.set(String(k), String(v)); },
  removeItem: (k) => { __store.delete(String(k)); },
  clear: () => { __store.clear(); },
  key: (i) => [...__store.keys()][i] ?? null,
  get length() { return __store.size; },
};
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true,
});
