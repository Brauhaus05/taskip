import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { C, FONT } from '../theme/tokens.js';

export default function BackHeader({ title, onBack }) {
  const nav = useNavigate();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 -6px 18px' }}>
      <button onClick={onBack || (() => nav(-1))} style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon path="m15 18-6-6 6-6" size={22} stroke={C.ink} width={2} />
      </button>
      <div style={{ fontFamily: FONT.head, fontSize: 20, fontWeight: 600, color: C.ink }}>{title}</div>
    </div>
  );
}
