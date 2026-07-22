import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import { C, heading, card } from '../theme/tokens.js';

export default function Payments() {
  const { state, dispatch, flash } = useStore();
  const nav = useNavigate();
  const { rent, autopay, payments } = state;

  const balanceLabel = rent.paid ? '$0.00' : '$1,850.00';
  const balanceSub = rent.paid ? `Next due ${rent.nextDue}` : `Due ${rent.dueDate}`;
  const payLabel = rent.paid ? 'View receipt' : 'Pay $1,850 now';
  const onPay = rent.paid
    ? () => flash(`Receipt ${rent.confirmation}`)
    : () => nav('/pay');

  const toggleAutopay = () => {
    dispatch({ type: 'toggleAutopay' });
    flash(autopay.enabled ? 'Autopay turned off' : 'Autopay turned on');
  };

  return (
    <div className="jh-fade" style={{ padding: '6px 20px 28px' }}>
      <div style={{ ...heading(26), marginBottom: 18 }}>Payments</div>

      <div style={{ ...card({ borderRadius: 24, padding: 22, marginBottom: 16, textAlign: 'center' }) }}>
        <div style={{ fontSize: 13, color: C.mute, fontWeight: 500 }}>Current balance</div>
        <div style={{ ...heading(44, { letterSpacing: '-.03em', margin: '2px 0 4px' }) }}>{balanceLabel}</div>
        <div style={{ fontSize: 13, color: C.mute, marginBottom: 18 }}>{balanceSub}</div>
        <button onClick={onPay} style={{ width: '100%', background: C.green, color: '#fff', fontWeight: 700, fontSize: 15, padding: 14, borderRadius: 14 }}>{payLabel}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <button onClick={toggleAutopay} style={{ textAlign: 'left', ...card({ borderRadius: 18, padding: 15 }) }}>
          <div style={{ fontSize: 12, color: C.mute, fontWeight: 500 }}>Autopay</div>
          <div style={{ fontWeight: 600, fontSize: 15, color: autopay.enabled ? C.green : C.mute, marginTop: 2 }}>
            {autopay.enabled ? `On · ${autopay.day}` : 'Off'}
          </div>
        </button>
        <div style={{ ...card({ borderRadius: 18, padding: 15 }) }}>
          <div style={{ fontSize: 12, color: C.mute, fontWeight: 500 }}>Paid in 2026</div>
          <div style={{ fontWeight: 600, fontSize: 15, color: C.ink, marginTop: 2 }}>{payments.paidYTD}</div>
        </div>
      </div>

      <div style={{ ...heading(17), marginBottom: 12 }}>Payment history</div>
      <div style={{ ...card({ overflow: 'hidden' }) }}>
        {payments.history.map((h) => (
          <button key={h.id} onClick={() => nav(`/receipt/${h.id}`)} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 13, padding: '15px 16px', borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon path="M20 6 9 17l-5-5" size={17} stroke={C.green} width={2.4} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{h.title}</div>
              <div style={{ fontSize: 12, color: C.mute }}>{h.date}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{h.amount}</div>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>{h.status}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
