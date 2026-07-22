import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import BackHeader from '../components/BackHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { C, FONT } from '../theme/tokens.js';

export default function RequestDetail() {
  const { id } = useParams();
  const { state, dispatch, flash } = useStore();
  const nav = useNavigate();
  const r = state.requests.find((x) => x.id === id);

  if (!r) return <div style={{ padding: 20 }}><BackHeader title="Request" />Request not found.</div>;

  const closed = ['Resolved', 'Cancelled'].includes(r.status);
  const cancel = () => { dispatch({ type: 'cancelRequest', id: r.id }); flash('Request cancelled'); };

  return (
    <div className="jh-fade" style={{ padding: '2px 20px 40px' }}>
      <BackHeader title="Request" />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
        <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: '-.02em', lineHeight: 1.25 }}>{r.title}</div>
        <StatusBadge label={r.status} color={r.statusColor} bg={r.statusBg} />
      </div>
      <div style={{ fontSize: 13, color: C.mute, marginBottom: 18 }}>{r.cat} · {r.priority} priority · {r.area}</div>

      {r.desc && (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 15, marginBottom: 18, fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{r.desc}</div>
      )}

      {r.photos.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          {r.photos.map((src, i) => (
            <div key={i} style={{ width: 78, height: 78, borderRadius: 14, backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', border: `1px solid ${C.border}` }} />
          ))}
        </div>
      )}

      <div style={{ fontFamily: FONT.head, fontSize: 17, fontWeight: 600, color: C.ink, marginBottom: 12 }}>Timeline</div>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '6px 16px', marginBottom: 22 }}>
        {r.updates.map((u, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderTop: i ? `1px solid ${C.borderLight}` : 'none' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', flex: 'none', background: C.green }} />
            <div style={{ flex: 1, fontSize: 14, color: C.ink, fontWeight: 500 }}>{u.label}</div>
            <div style={{ fontSize: 12, color: C.mute }}>{u.date}</div>
          </div>
        ))}
      </div>

      {!closed && (
        <button onClick={cancel} style={{ width: '100%', background: '#fff', color: C.red, fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 16, border: `1.5px solid ${C.border}` }}>Cancel request</button>
      )}
      <div style={{ marginTop: 12 }}>
        <button onClick={() => nav('/maintenance')} style={{ width: '100%', color: C.mute, fontWeight: 600, fontSize: 14, padding: 8 }}>Back to all requests</button>
      </div>
    </div>
  );
}
