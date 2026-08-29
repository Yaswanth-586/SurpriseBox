export interface ThemeConfig {
  id: string;
  name: string;
  background: string;
  particles: string[];
  glassBg: string;
  textColor: string;
  accent: string;
  fontFamily: string;
}

export interface BoxStyleConfig {
  id: string;
  name: string;
  lid: string;
  body: string;
  ribbon: string;
  sparkles: string[];
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'elegant',
    name: 'Elegant (Default)',
    background: 'bg-slate-900', 
    particles: ['#a855f7', '#ec4899', '#f59e0b', '#6366f1'],
    glassBg: 'bg-white/10 border-white/20',
    textColor: 'text-white',
    accent: 'purple',
    fontFamily: 'font-sans',
  },
  {
    id: 'romantic',
    name: 'Romantic',
    background: 'bg-gradient-to-br from-rose-950 via-red-900 to-rose-950',
    particles: ['#f43f5e', '#fb7185', '#fda4af', '#fff1f2'],
    glassBg: 'bg-rose-500/10 border-rose-400/20',
    textColor: 'text-rose-50',
    accent: 'rose',
    fontFamily: 'font-serif',
  },
  {
    id: 'birthday',
    name: 'Birthday Party',
    background: 'bg-gradient-to-br from-sky-900 via-indigo-900 to-purple-900',
    particles: ['#fcd34d', '#34d399', '#60a5fa', '#f472b6'],
    glassBg: 'bg-white/10 border-white/20',
    textColor: 'text-white',
    accent: 'pink',
    fontFamily: 'font-sans',
  },
  {
    id: 'magical',
    name: 'Magical',
    background: 'bg-gradient-to-tr from-violet-950 via-fuchsia-900 to-indigo-950',
    particles: ['#c084fc', '#e879f9', '#2dd4bf', '#818cf8'],
    glassBg: 'bg-fuchsia-500/10 border-fuchsia-400/20',
    textColor: 'text-fuchsia-50',
    accent: 'fuchsia',
    fontFamily: 'font-sans',
  },
  {
    id: 'festival',
    name: 'Festival',
    background: 'bg-gradient-to-br from-orange-950 via-red-900 to-amber-950',
    particles: ['#f59e0b', '#ef4444', '#fbbf24', '#f87171'],
    glassBg: 'bg-orange-500/10 border-orange-400/20',
    textColor: 'text-orange-50',
    accent: 'orange',
    fontFamily: 'font-sans',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    background: 'bg-gradient-to-br from-red-950 via-emerald-950 to-red-900',
    particles: ['#ffffff', '#fecaca', '#a7f3d0', '#fef08a'],
    glassBg: 'bg-emerald-500/10 border-emerald-400/20',
    textColor: 'text-red-50',
    accent: 'emerald',
    fontFamily: 'font-serif',
  },
  {
    id: 'diwali',
    name: 'Diwali',
    background: 'bg-gradient-to-br from-amber-950 via-orange-900 to-yellow-950',
    particles: ['#f59e0b', '#fbbf24', '#fde68a', '#ffedd5'],
    glassBg: 'bg-amber-500/10 border-amber-400/20',
    textColor: 'text-amber-50',
    accent: 'amber',
    fontFamily: 'font-sans',
  },
  {
    id: 'holi',
    name: 'Holi',
    background: 'bg-gradient-to-br from-fuchsia-900 via-rose-500 to-amber-500',
    particles: ['#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#c084fc'],
    glassBg: 'bg-white/20 border-white/30',
    textColor: 'text-white',
    accent: 'pink',
    fontFamily: 'font-sans',
  },
  {
    id: 'ugadi',
    name: 'Ugadi',
    background: 'bg-gradient-to-br from-green-950 via-emerald-900 to-lime-950',
    particles: ['#bef264', '#fde047', '#86efac', '#fcd34d'],
    glassBg: 'bg-emerald-500/20 border-emerald-400/30',
    textColor: 'text-emerald-50',
    accent: 'lime',
    fontFamily: 'font-sans',
  },
  {
    id: 'sankranti',
    name: 'Sankranti',
    background: 'bg-gradient-to-br from-yellow-950 via-amber-700 to-orange-900',
    particles: ['#fef08a', '#fcd34d', '#fbbf24', '#f59e0b'],
    glassBg: 'bg-amber-500/20 border-amber-400/30',
    textColor: 'text-amber-50',
    accent: 'amber',
    fontFamily: 'font-sans',
  },
  {
    id: 'eid',
    name: 'Eid',
    background: 'bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950',
    particles: ['#fcd34d', '#fbbf24', '#fef3c7', '#34d399'],
    glassBg: 'bg-emerald-500/10 border-amber-500/30',
    textColor: 'text-emerald-50',
    accent: 'amber',
    fontFamily: 'font-serif',
  },
  {
    id: 'graduation',
    name: 'Graduation',
    background: 'bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-900',
    particles: ['#fbbf24', '#f59e0b', '#bfdbfe', '#ffffff'],
    glassBg: 'bg-indigo-500/10 border-indigo-400/20',
    textColor: 'text-blue-50',
    accent: 'blue',
    fontFamily: 'font-serif',
  },
  {
    id: 'friendship',
    name: 'Friendship',
    background: 'bg-gradient-to-br from-amber-200 via-orange-100 to-yellow-200',
    particles: ['#f59e0b', '#14b8a6', '#f43f5e', '#8b5cf6'],
    glassBg: 'bg-white/50 border-white/60 shadow-xl',
    textColor: 'text-slate-800',
    accent: 'teal',
    fontFamily: 'font-sans',
  },
  {
    id: 'wedding',
    name: 'Wedding',
    background: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
    particles: ['#e2e8f0', '#cbd5e1', '#f8fafc', '#f1f5f9'],
    glassBg: 'bg-white/70 border-white shadow-xl',
    textColor: 'text-slate-800',
    accent: 'slate',
    fontFamily: 'font-serif',
  },
  {
    id: 'achievement',
    name: 'Achievement',
    background: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-950',
    particles: ['#fcd34d', '#f59e0b', '#fbbf24', '#ffffff'],
    glassBg: 'bg-blue-500/20 border-amber-400/30',
    textColor: 'text-blue-50',
    accent: 'cyan',
    fontFamily: 'font-sans',
  },
  {
    id: 'dark-luxury',
    name: 'Dark Luxury',
    background: 'bg-gradient-to-br from-black via-zinc-900 to-black',
    particles: ['#fbbf24', '#f59e0b', '#d97706', '#b45309'],
    glassBg: 'bg-zinc-800/50 border-amber-500/30',
    textColor: 'text-amber-50',
    accent: 'amber',
    fontFamily: 'font-serif',
  },
  {
    id: 'pastel',
    name: 'Soft Pastel',
    background: 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100',
    particles: ['#f472b6', '#a78bfa', '#60a5fa', '#34d399'],
    glassBg: 'bg-white/40 border-white/60 shadow-xl',
    textColor: 'text-slate-800',
    accent: 'purple',
    fontFamily: 'font-sans',
  }
];

export const BOX_STYLES: BoxStyleConfig[] = [
  {
    id: 'classic',
    name: 'Classic Purple',
    lid: 'from-purple-500 to-purple-600',
    body: 'from-purple-600 to-purple-800',
    ribbon: 'from-amber-400 via-yellow-300 to-amber-400',
    sparkles: ['#a855f7', '#ec4899', '#f59e0b', '#6366f1'],
  },
  {
    id: 'ruby',
    name: 'Ruby Red',
    lid: 'from-red-500 to-red-600',
    body: 'from-red-600 to-red-800',
    ribbon: 'from-slate-200 via-white to-slate-200',
    sparkles: ['#ef4444', '#f87171', '#ffffff', '#fca5a5'],
  },
  {
    id: 'gold',
    name: 'Luxury Gold',
    lid: 'from-amber-400 to-amber-500',
    body: 'from-amber-500 to-amber-700',
    ribbon: 'from-zinc-800 via-zinc-700 to-zinc-800',
    sparkles: ['#fbbf24', '#f59e0b', '#ffffff', '#d97706'],
  },
  {
    id: 'sapphire',
    name: 'Sapphire Blue',
    lid: 'from-blue-500 to-blue-600',
    body: 'from-blue-600 to-blue-800',
    ribbon: 'from-cyan-300 via-cyan-100 to-cyan-300',
    sparkles: ['#3b82f6', '#60a5fa', '#22d3ee', '#67e8f9'],
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    lid: 'from-emerald-500 to-emerald-600',
    body: 'from-emerald-600 to-emerald-800',
    ribbon: 'from-red-400 via-red-300 to-red-400',
    sparkles: ['#10b981', '#34d399', '#f87171', '#ef4444'],
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    lid: 'from-zinc-800 to-zinc-900',
    body: 'from-zinc-900 to-black',
    ribbon: 'from-amber-400 via-yellow-300 to-amber-400',
    sparkles: ['#fbbf24', '#ffffff', '#9ca3af', '#f59e0b'],
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    lid: 'from-rose-300 to-rose-400',
    body: 'from-rose-400 to-rose-600',
    ribbon: 'from-white via-slate-100 to-white',
    sparkles: ['#fb7185', '#fda4af', '#ffffff', '#ffe4e6'],
  }
];

export function getTheme(id: string): ThemeConfig {
  return THEMES.find(t => t.id === id) || THEMES[0];
}

export function getBoxStyle(id: string): BoxStyleConfig {
  return BOX_STYLES.find(b => b.id === id) || BOX_STYLES[0];
}
