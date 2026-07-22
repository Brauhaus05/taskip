import { useLocation } from 'react-router-dom';
import TabBar from './TabBar.jsx';
import Toast from './Toast.jsx';
import { C } from '../theme/tokens.js';

const TAB_ROUTES = ['/', '/payments', '/maintenance', '/messages'];

export default function Shell({ children }) {
  const { pathname } = useLocation();
  const showTabBar = TAB_ROUTES.includes(pathname);
  return (
    <div style={{ minHeight: '100dvh', background: C.bg, display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: '100%', maxWidth: 440, minHeight: '100dvh', background: C.surface,
        position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        <div className="scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', paddingTop: 12 }}>
          {children}
        </div>
        {showTabBar && <TabBar />}
        <Toast />
      </div>
    </div>
  );
}
