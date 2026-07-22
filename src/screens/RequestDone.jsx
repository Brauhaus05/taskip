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
