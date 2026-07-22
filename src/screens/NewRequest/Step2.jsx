import { PRIORITIES, PRIORITY_COLOR } from '../../data/seed.js';
import { C, FONT } from '../../theme/tokens.js';

export default function Step2({ draft, set }) {
  return (
    <div className="jh-fade">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: C.warmBg, borderRadius: 20, padding: '6px 12px', fontSize: 12.5, fontWeight: 600, color: C.sub, marginBottom: 16 }}>{draft.cat}</div>
      <div style={{ fontFamily: FONT.head, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: '-.02em', marginBottom: 16 }}>Tell us more</div>

      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 7 }}>Title</div>
      <input value={draft.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Leaking faucet under sink"
        style={{ width: '100%', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 14, fontSize: 14, color: C.ink, outline: 'none', marginBottom: 16 }} />

      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 7 }}>Description</div>
      <textarea value={draft.desc} onChange={(e) => set({ desc: e.target.value })} placeholder="What's happening? When did it start?" rows={4}
        style={{ width: '100%', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 14, fontSize: 14, color: C.ink, outline: 'none', resize: 'none', marginBottom: 18 }} />

      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 9 }}>Priority</div>
      <div style={{ display: 'flex', gap: 9 }}>
        {PRIORITIES.map((p) => {
          const on = draft.priority === p;
          return (
            <button key={p} onClick={() => set({ priority: p })} style={{ flex: 1, padding: 11, borderRadius: 13, fontSize: 13.5, fontWeight: 600, border: `1.5px solid ${on ? PRIORITY_COLOR[p] : C.border}`, background: '#fff', color: on ? PRIORITY_COLOR[p] : C.mute }}>{p}</button>
          );
        })}
      </div>
    </div>
  );
}
