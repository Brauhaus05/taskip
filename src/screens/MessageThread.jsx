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
