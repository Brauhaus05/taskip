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
