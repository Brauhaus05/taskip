import Icon from '../../components/Icon.jsx';
import { CATEGORIES } from '../../data/seed.js';
import { C, FONT } from '../../theme/tokens.js';

export default function Step1({ onPick }) {
  return (
    <div className="jh-fade">
      <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: '-.02em', marginBottom: 4 }}>What needs fixing?</div>
      <div style={{ fontSize: 14, color: C.mute, marginBottom: 20 }}>Pick the closest category</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {CATEGORIES.map((c) => (
          <button key={c.label} onClick={() => onPick(c.label)} style={{ textAlign: 'left', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '16px 15px' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 11 }}>
              <Icon path={c.icon} size={21} stroke={c.fg} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{c.label}</div>
            <div style={{ fontSize: 11.5, color: C.mute, marginTop: 1 }}>{c.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
