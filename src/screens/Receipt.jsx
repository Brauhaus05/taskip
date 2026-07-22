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
          <span>Confirmation</span><span style={{ color: C.ink, fontWeight: 600 }}>{p.confirmation}</span>
        </div>
      </div>
      <div style={{ marginTop: 22 }}>
        <button onClick={() => nav('/payments')} style={primaryBtn()}>Done</button>
      </div>
    </div>
  );
}
