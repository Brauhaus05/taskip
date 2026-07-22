export default function StatusBadge({ label, color, bg }) {
  return (
    <span style={{
      flex: 'none', fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 20,
      background: bg, color,
    }}>{label}</span>
  );
}
