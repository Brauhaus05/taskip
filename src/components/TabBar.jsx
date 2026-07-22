import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import { C } from '../theme/tokens.js';

const TABS = [
  { to: '/', label: 'Home', path: ['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'] },
  { to: '/payments', label: 'Payments', path: ['M2 5h20v14H2zM2 10h20'] },
  { to: '/maintenance', label: 'Repairs', path: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'] },
  { to: '/messages', label: 'Inbox', path: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'] },
];

export default function TabBar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  return (
    <div style={{
      flex: 'none', height: 88, background: 'rgba(246,243,238,.92)', backdropFilter: 'blur(14px)',
      borderTop: `1px solid ${C.border}`, display: 'flex', padding: '10px 12px 26px', zIndex: 10,
    }}>
      {TABS.map((t) => {
        const active = t.to === '/' ? pathname === '/' : pathname.startsWith(t.to);
        return (
          <button key={t.to} onClick={() => nav(t.to)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: active ? C.green : C.mute2,
          }}>
            <Icon path={t.path} size={24} />
            <span style={{ fontSize: 10.5, fontWeight: 600 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
