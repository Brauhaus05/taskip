import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import { C, FONT, heading, card } from '../theme/tokens.js';

export default function Home() {
  const { state } = useStore();
  const nav = useNavigate();
  const { user, property, rent, activity } = state;

  return (
    <div className="jh-fade" style={{ padding: '6px 20px 28px' }}>
      {/* greeting + bell */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 13, color: C.mute, fontWeight: 500 }}>{user.greeting}</div>
          <div style={heading(24)}>{user.name}</div>
        </div>
        <button onClick={() => nav('/messages')} style={{ width: 44, height: 44, borderRadius: 15, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Icon path={['M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9', 'M10.3 21a1.94 1.94 0 0 0 3.4 0']} size={21} stroke={C.ink} width={1.8} />
          <span style={{ position: 'absolute', top: 9, right: 11, width: 8, height: 8, borderRadius: '50%', background: C.red, border: '2px solid #fff' }} />
        </button>
      </div>

      {/* property strip -> /property */}
      <button onClick={() => nav('/property')} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, ...card({ borderRadius: 18, padding: 10, marginBottom: 16 }) }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, flex: 'none', background: 'repeating-linear-gradient(135deg,#E7E2D8,#E7E2D8 6px,#EFEAE1 6px,#EFEAE1 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon path={['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10']} size={22} stroke={C.mute} width={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: C.ink }}>{property.name}</div>
          <div style={{ fontSize: 13, color: C.mute }}>{property.unit} · {property.address}</div>
        </div>
        <Icon path="m9 18 6-6-6-6" size={20} stroke={C.muted} width={2} />
      </button>

      {/* rent card */}
      {rent.paid ? (
        <div style={{ background: C.green, borderRadius: 24, padding: 22, color: '#fff', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, opacity: .9, marginBottom: 6 }}>
            <Icon path="M20 6 9 17l-5-5" size={18} stroke="#fff" width={2.4} /> You're all paid up
          </div>
          <div style={{ fontFamily: FONT.head, fontSize: 30, fontWeight: 600, letterSpacing: '-.02em' }}>August rent settled</div>
          <div style={{ fontSize: 13, opacity: .8, marginTop: 4 }}>Next payment due {rent.nextDue}</div>
        </div>
      ) : (
        <div style={{ background: C.green, borderRadius: 24, padding: 22, color: '#fff', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
          <div style={{ fontSize: 13, fontWeight: 500, opacity: .85 }}>Rent due · {rent.dueDate}</div>
          <div style={{ fontFamily: FONT.head, fontSize: 40, fontWeight: 600, letterSpacing: '-.02em', margin: '2px 0' }}>{rent.amountLabel}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, opacity: .8, marginBottom: 16 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E7C87A' }} /> Due in 12 days
          </div>
          <button onClick={() => nav('/pay')} style={{ width: '100%', background: '#fff', color: C.greenDarker, fontWeight: 700, fontSize: 15, padding: 13, borderRadius: 14 }}>Pay now</button>
        </div>
      )}

      {/* quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
        <button onClick={() => nav('/pay')} style={{ textAlign: 'left', ...card({ borderRadius: 18, padding: 16 }) }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Icon path={['M2 5h20v14H2zM2 10h20']} size={20} stroke={C.green} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>Pay rent</div>
          <div style={{ fontSize: 12, color: C.mute }}>Card or bank</div>
        </button>
        <button onClick={() => nav('/requests/new')} style={{ textAlign: 'left', ...card({ borderRadius: 18, padding: 16 }) }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.goldBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Icon path="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" size={20} stroke={C.gold} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>New request</div>
          <div style={{ fontSize: 12, color: C.mute }}>Report an issue</div>
        </button>
      </div>

      {/* recent activity */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ ...heading(17) }}>Recent activity</div>
        <span style={{ fontSize: 13, color: C.mute, fontWeight: 500 }}>This month</span>
      </div>
      <div style={{ ...card({ overflow: 'hidden' }) }}>
        {activity.map((a) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderTop: `1px solid ${C.borderLight}` }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', background: C.warmBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub }}>
              <Icon path={a.icon} size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{a.title}</div>
              <div style={{ fontSize: 12, color: C.mute }}>{a.sub}</div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{a.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
