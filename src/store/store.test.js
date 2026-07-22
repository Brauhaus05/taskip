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
