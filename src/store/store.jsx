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
      const confirmation = nextConf();
      const payment = {
        id: `p-2026-08`,
        title: 'August Rent',
        date: 'Aug 1, 2026',
        amount: state.rent.amountLabel,
        status: 'Paid',
        method: action.method,
        confirmation,
      };
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
