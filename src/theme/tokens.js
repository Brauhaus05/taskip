export const C = {
  bg: '#E9E4DA',
  surface: '#F6F3EE',
  card: '#FFFFFF',
  border: '#E7E2D8',
  borderLight: '#F1ECE3',
  green: '#40694E',
  greenDark: '#2E5039',
  greenDarker: '#26402E',
  ink: '#1D1B16',
  sub: '#6B6656',
  mute: '#8A8474',
  mute2: '#A8A296',
  muted: '#B7B1A2',
  faint: '#B4B1A2',
  gold: '#B07A2E',
  red: '#B4472F',
  purple: '#6C5FA6',
  blue: '#3E7A96',
  greenBg: '#E8EFE8',
  goldBg: '#F6ECDB',
  purpleBg: '#EAE7F2',
  blueBg: '#E4EEF2',
  warmBg: '#F4F0E8',
  redBg: '#F6E2DC',
  neutralBg: '#EFEBE3',
};

export const FONT = {
  head: "'Bricolage Grotesque', system-ui, sans-serif",
  body: "'Plus Jakarta Sans', system-ui, sans-serif",
};

// Shared style factories (DRY) --------------------------------------------
export const card = (extra = {}) => ({
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 20,
  ...extra,
});

export const primaryBtn = (extra = {}) => ({
  width: '100%',
  background: C.green,
  color: '#fff',
  fontWeight: 700,
  fontSize: 16,
  padding: 16,
  borderRadius: 16,
  ...extra,
});

export const heading = (size, extra = {}) => ({
  fontFamily: FONT.head,
  fontSize: size,
  fontWeight: 600,
  color: C.ink,
  letterSpacing: '-.02em',
  ...extra,
});

export const screenPad = { padding: '6px 20px 28px' };
