export default function Icon({ path, size = 18, stroke = 'currentColor', width = 1.9, fill = 'none', style }) {
  const paths = Array.isArray(path) ? path : [path];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
