import { initialState } from '../data/seed.js';

export const STORAGE_KEY = 'taskip:v1';

// Uploaded photos are in-memory blob: object URLs that are invalid after a
// reload, so we drop them before persisting — keeps storage clean and avoids
// rendering broken images. All other data round-trips.
function stripDeadPhotos(requests) {
  if (!Array.isArray(requests)) return [];
  return requests.map((r) => ({
    ...r,
    photos: Array.isArray(r.photos)
      ? r.photos.filter((p) => !String(p).startsWith('blob:'))
      : [],
  }));
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const saved = JSON.parse(raw);
    const merged = { ...initialState(), ...saved, toast: null };
    merged.requests = stripDeadPhotos(merged.requests);
    return merged;
  } catch {
    return initialState();
  }
}

export function saveState(state) {
  try {
    const toSave = { ...state, requests: stripDeadPhotos(state.requests), toast: null };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore quota / serialization errors — persistence is best-effort
  }
}

export function clearPersistedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
