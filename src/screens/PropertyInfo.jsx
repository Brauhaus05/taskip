import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store.jsx';
import Icon from '../components/Icon.jsx';
import BackHeader from '../components/BackHeader.jsx';
import { C, FONT } from '../theme/tokens.js';

export default function PropertyInfo() {
  const { state } = useStore();
  const nav = useNavigate();
  const { property } = state;

  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: C.sub, padding: '12px 0', borderTop: `1px solid ${C.borderLight}` }}>
      <span>{label}</span><span style={{ color: C.ink, fontWeight: 600 }}>{value}</span>
    </div>
  );

  return (
    <div className="jh-fade" style={{ padding: '2px 20px 40px' }}>
      <BackHeader title="Property" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, flex: 'none', background: 'repeating-linear-gradient(135deg,#E7E2D8,#E7E2D8 6px,#EFEAE1 6px,#EFEAE1 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon path={['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10']} size={26} stroke={C.mute} width={1.8} />
        </div>
        <div>
          <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color: C.ink }}>{property.name}</div>
          <div style={{ fontSize: 13.5, color: C.mute }}>{property.unit}</div>
        </div>
      </div>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '0 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: C.sub, padding: '12px 0' }}>
          <span>Address</span><span style={{ color: C.ink, fontWeight: 600 }}>{property.address}</span>
        </div>
        <Row label="Unit" value={property.unit} />
        <Row label="Lease" value="Through Dec 2026" />
        <Row label="Manager" value="Jordan Reyes" />
      </div>
      <button onClick={() => nav('/messages/t-1')} style={{ width: '100%', background: C.green, color: '#fff', fontWeight: 700, fontSize: 15, padding: 15, borderRadius: 16 }}>Message property manager</button>
    </div>
  );
}
