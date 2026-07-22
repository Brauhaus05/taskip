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
