import { useRef } from 'react';
import Icon from '../../components/Icon.jsx';
import { AREAS } from '../../data/seed.js';
import { C, FONT } from '../../theme/tokens.js';

export default function Step3({ draft, set }) {
  const fileRef = useRef(null);

  const onFiles = (e) => {
    const urls = Array.from(e.target.files || []).map((f) => URL.createObjectURL(f));
    if (urls.length) set({ photos: [...draft.photos, ...urls] });
  };

  return (
    <div className="jh-fade">
      <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: '-.02em', marginBottom: 16 }}>Photos & location</div>

      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 9 }}>Add photos <span style={{ color: C.muted, fontWeight: 500 }}>(optional)</span></div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} style={{ display: 'none' }} />
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => fileRef.current?.click()} style={{ width: 78, height: 78, borderRadius: 14, border: `1.5px dashed ${C.muted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBF9F5' }}>
          <Icon path={['M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z', 'M12 13m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0']} size={24} stroke={C.mute2} width={1.8} />
        </button>
        {draft.photos.map((src, i) => (
          <div key={i} style={{ width: 78, height: 78, borderRadius: 14, backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', border: `1px solid ${C.border}` }} />
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 9 }}>Where in the unit?</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: 22 }}>
        {AREAS.map((a) => {
          const on = draft.area === a;
          return (
            <button key={a} onClick={() => set({ area: a })} style={{ padding: '9px 15px', borderRadius: 20, fontSize: 13, fontWeight: 600, border: `1.5px solid ${on ? C.green : C.border}`, background: on ? C.green : '#fff', color: on ? '#fff' : C.sub }}>{a}</button>
          );
        })}
      </div>

      <div style={{ background: C.warmBg, borderRadius: 16, padding: 15, marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.mute, marginBottom: 8 }}>Summary</div>
        <div style={{ fontSize: 14, color: C.ink, fontWeight: 600, marginBottom: 3 }}>{draft.title || 'Untitled request'}</div>
        <div style={{ fontSize: 12.5, color: C.sub }}>{draft.cat} · {draft.priority} priority · {draft.area}</div>
      </div>
    </div>
  );
}
