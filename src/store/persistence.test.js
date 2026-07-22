import { describe, it, expect, beforeEach } from 'vitest';
import { loadState, saveState, clearPersistedState, STORAGE_KEY } from './persistence.js';
import { initialState } from '../data/seed.js';

beforeEach(() => {
  localStorage.clear();
});

describe('persistence', () => {
  it('loadState returns fresh initialState when nothing is stored', () => {
    const s = loadState();
    expect(s.rent.paid).toBe(false);
    expect(s.requests.length).toBe(initialState().requests.length);
  });

  it('saveState then loadState round-trips changed data', () => {
    const s = initialState();
    s.rent.paid = true;
    s.autopay.enabled = false;
    saveState(s);
    const loaded = loadState();
    expect(loaded.rent.paid).toBe(true);
    expect(loaded.autopay.enabled).toBe(false);
  });

  it('does not persist the transient toast', () => {
    const s = { ...initialState(), toast: 'Saved!' };
    saveState(s);
    expect(loadState().toast).toBe(null);
  });

  it('strips dead blob: photo URLs on save and load', () => {
    const s = initialState();
    s.requests = [
      { ...s.requests[0], photos: ['blob:http://x/abc', 'data:image/png;base64,AAA'] },
      ...s.requests.slice(1),
    ];
    saveState(s);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored.requests[0].photos).toEqual(['data:image/png;base64,AAA']);
    expect(loadState().requests[0].photos).toEqual(['data:image/png;base64,AAA']);
  });

  it('falls back to initialState on corrupt stored JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(loadState().rent.paid).toBe(false);
  });

  it('clearPersistedState removes the saved state', () => {
    saveState(initialState());
    clearPersistedState();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
  });
});
