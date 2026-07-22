import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { C, FONT, heading, card } from '../theme/tokens.js';

export default function Maintenance() {
  const { state } = useStore();
  const nav = useNavigate();
  const reqs = state.requests;

  const count = (pred) => reqs.filter(pred).length;
  const openN = count((r) => ['Submitted', 'In progress'].includes(r.status));
  const schedN = count((r) => r.status === 'Scheduled');
  const doneN = count((r) => ['Resolved', 'Cancelled'].includes(r.status));

  const Stat = ({ n, label, color }) => (
    <div style={{ flex: 1, ...card({ borderRadius: 16, padding: 14 }) }}>
      <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color }}>{n}</div>
      <div style={{ fontSize: 12, color: C.mute, fontWeight: 500 }}>{label}</div>
    </div>
  );

  return (
    <div className="jh-fade" style={{ padding: '6px 20px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={heading(26)}>Maintenance</div>
        <button onClick={() => nav('/requests/new')} style={{ width: 42, height: 42, borderRadius: 14, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon path="M12 5v14M5 12h14" size={22} stroke="#fff" width={2.4} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <Stat n={openN} label="Open" color={C.gold} />
        <Stat n={schedN} label="Scheduled" color={C.green} />
        <Stat n={doneN} label="Resolved" color={C.mute} />
      </div>

      <div style={{ ...heading(17), marginBottom: 12 }}>Your requests</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reqs.map((r) => (
          <button key={r.id} onClick={() => nav(`/requests/${r.id}`)} style={{ width: '100%', textAlign: 'left', ...card({ borderRadius: 18, padding: 16 }) }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: C.ink, lineHeight: 1.3 }}>{r.title}</div>
              <StatusBadge label={r.status} color={r.statusColor} bg={r.statusBg} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: C.mute }}>
              <span>{r.cat}</span><span style={{ opacity: .4 }}>·</span><span>{r.date}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
