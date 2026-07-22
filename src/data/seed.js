import { C } from '../theme/tokens.js';

// Reusable SVG path strings from the prototype.
export const PATHS = {
  card: 'M2 5h20v14H2zM2 10h20',
  wrench:
    'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  bank: 'M3 21h18M4 10h16M5 10 12 4l7 6M6 10v11M18 10v11M10 10v11M14 10v11',
  check: 'M20 6 9 17l-5-5',
};

export const CATEGORIES = [
  { label: 'Plumbing', desc: 'Leaks, drains', bg: C.blueBg, fg: C.blue, icon: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' },
  { label: 'Electrical', desc: 'Lights, outlets', bg: C.goldBg, fg: C.gold, icon: 'M13 2 3 14h9l-1 8 10-12h-9z' },
  { label: 'Appliance', desc: 'Fridge, stove', bg: C.purpleBg, fg: C.purple, icon: 'M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z' },
  { label: 'Heating & Cooling', desc: 'AC, heat', bg: C.greenBg, fg: C.green, icon: 'M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4 4 0 1 0 5 0z' },
  { label: 'Structural', desc: 'Walls, doors', bg: C.borderLight, fg: C.sub, icon: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { label: 'Other', desc: 'Something else', bg: C.redBg, fg: C.red, icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v8M8 12h8' },
];

export const PRIORITIES = ['Low', 'Medium', 'Urgent'];
export const PRIORITY_COLOR = { Low: C.green, Medium: C.gold, Urgent: C.red };
export const AREAS = ['Kitchen', 'Bathroom', 'Bedroom', 'Living room', 'Other'];

export const PAY_METHODS = [
  { id: 'card', label: 'Visa ··4242', sub: 'Debit card', iconBg: C.greenBg, iconFg: C.green, icon: PATHS.card },
  { id: 'bank', label: 'Chase checking', sub: 'Bank ··8891', iconBg: C.purpleBg, iconFg: C.purple, icon: PATHS.bank },
];

export function initialState() {
  return {
    user: { name: 'Mara Ellison', greeting: 'Good morning' },
    property: { name: 'Maple Court', unit: 'Unit 4B', address: '128 Maple Ave' },
    rent: {
      amount: 1850,
      amountLabel: '$1,850',
      dueDate: 'Aug 1, 2026',
      nextDue: 'Sep 1, 2026',
      paid: false,
      confirmation: '#JH-4471-AUG',
      method: 'Visa ··4242',
    },
    autopay: { enabled: true, day: '1st' },
    payments: {
      paidYTD: '$12,950',
      history: [
        { id: 'p-2026-07', title: 'July Rent', date: 'Jul 1, 2026', amount: '$1,850', status: 'Paid', method: 'Visa ··4242' },
        { id: 'p-2026-06', title: 'June Rent', date: 'Jun 1, 2026', amount: '$1,850', status: 'Paid', method: 'Visa ··4242' },
        { id: 'p-2026-05', title: 'May Rent', date: 'May 1, 2026', amount: '$1,850', status: 'Paid', method: 'Visa ··4242' },
      ],
    },
    requests: [
      { id: 'r-101', title: 'Leaking kitchen faucet', cat: 'Plumbing', priority: 'Medium', area: 'Kitchen', desc: 'Water drips steadily from the base of the faucet.', status: 'In progress', statusColor: C.gold, statusBg: C.goldBg, date: 'Jul 14', photos: [], updates: [{ label: 'Submitted', date: 'Jul 14' }, { label: 'Plumber assigned', date: 'Jul 15' }] },
      { id: 'r-102', title: 'Hallway light flickering', cat: 'Electrical', priority: 'Low', area: 'Living room', desc: 'The ceiling light in the hallway flickers at night.', status: 'Scheduled', statusColor: C.green, statusBg: C.greenBg, date: 'Jul 10', photos: [], updates: [{ label: 'Submitted', date: 'Jul 10' }, { label: 'Visit scheduled Jul 22', date: 'Jul 12' }] },
      { id: 'r-103', title: 'AC not cooling well', cat: 'Heating & Cooling', priority: 'Urgent', area: 'Bedroom', desc: 'Bedroom stays warm even with AC running.', status: 'Resolved', statusColor: C.mute, statusBg: C.neutralBg, date: 'Jun 28', photos: [], updates: [{ label: 'Submitted', date: 'Jun 28' }, { label: 'Resolved', date: 'Jul 2' }] },
    ],
    threads: [
      { id: 't-1', initials: 'JR', name: 'Jordan Reyes', role: 'Property manager', time: '2h', bg: C.greenBg, fg: C.green, messages: [{ from: 'them', text: 'Hi Mara — the plumber will come Tuesday 9–11am.', time: '2h' }] },
      { id: 't-2', initials: 'MC', name: 'Maple Court', role: 'Building', time: '1d', bg: C.goldBg, fg: C.gold, messages: [{ from: 'them', text: 'Reminder: water shut-off Thursday 1–3pm.', time: '1d' }] },
      { id: 't-3', initials: 'SU', name: 'Support', role: 'Taskip', time: '3d', bg: C.purpleBg, fg: C.purple, messages: [{ from: 'them', text: 'How was your recent repair?', time: '3d' }] },
    ],
    activity: [
      { id: 'a-1', icon: PATHS.card, title: 'July rent', sub: 'Jul 1 · Visa ··4242', amount: '$1,850' },
      { id: 'a-2', icon: PATHS.wrench, title: 'Faucet repair scheduled', sub: 'Jul 15 · Plumbing', amount: '' },
      { id: 'a-3', icon: PATHS.chat, title: 'Message from Jordan', sub: 'Property manager', amount: '' },
    ],
    toast: null,
  };
}
