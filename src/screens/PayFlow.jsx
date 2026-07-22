import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import BackHeader from '../components/BackHeader.jsx';
import { PAY_METHODS } from '../data/seed.js';
import { C, FONT, primaryBtn } from '../theme/tokens.js';

export default function PayFlow() {
  const { state, dispatch } = useStore();
  const nav = useNavigate();
  const [method, setMethod] = useState('card');

  const confirm = () => {
    const label = PAY_METHODS.find((m) => m.id === method).label;
    dispatch({ type: 'payRent', method: label });
    nav('/pay/done');
  };

  const Row = ({ label, value, bold, border }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: bold ? 15 : 13.5, fontWeight: bold ? 700 : 400, color: bold ? C.ink : C.sub, paddingTop: border ? 10 : 0, paddingBottom: border === 'mid' ? 10 : 0, borderBottom: border === 'mid' ? `1px solid ${C.borderLight}` : 'none', marginBottom: border === 'mid' ? 0 : 8 }}>
      <span>{label}</span><span style={{ color: C.ink, fontWeight: bold ? 700 : 500 }}>{value}</span>
    </div>
  );

  return (
    <div className="jh-fade" style={{ padding: '2px 20px 40px' }}>
      <BackHeader title="Pay rent" onBack={() => nav('/')} />
      <div style={{ textAlign: 'center', padding: '18px 0 22px' }}>
        <div style={{ fontSize: 13, color: C.mute, fontWeight: 500 }}>Amount due · Aug 1</div>
        <div style={{ fontFamily: FONT.head, fontSize: 52, fontWeight: 600, color: C.ink, letterSpacing: '-.03em' }}>{state.rent.amountLabel}</div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: C.mute, marginBottom: 10 }}>Payment method</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {PAY_METHODS.map((m) => {
          const sel = method === m.id;
          return (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 13, background: '#fff', border: `1.5px solid ${sel ? C.green : C.border}`, borderRadius: 16, padding: '14px 15px', textAlign: 'left' }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, flex: 'none', background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon path={m.icon} size={20} stroke={m.iconFg} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{m.label}</div>
                <div style={{ fontSize: 12, color: C.mute }}>{m.sub}</div>
              </div>
              {sel ? (
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon path="M20 6 9 17l-5-5" size={13} stroke="#fff" width={3} />
                </div>
              ) : (
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #E0DACE' }} />
              )}
            </button>
          );
        })}
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 15, marginBottom: 22 }}>
        <Row label="Rent" value="$1,850.00" />
        <Row label="Processing fee" value="$0.00" border="mid" />
        <Row label="Total" value="$1,850.00" bold border />
      </div>
      <button onClick={confirm} style={primaryBtn()}>Confirm payment</button>
      <div style={{ textAlign: 'center', fontSize: 12, color: C.muted, marginTop: 12 }}>Secured · payment processed instantly</div>
    </div>
  );
}
