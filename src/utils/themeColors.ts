export interface ColorTheme {
  id: string;
  name: string;
  hex: string;
  gradientFrom: string;
  gradientTo: string;
  accentBg: string;
  accentText: string;
  activeTabBg: string;
  activeTabText: string;
  badgeBg: string;
  btnBg: string;
  btnHover: string;
  borderLeft: string;
  ringFocus: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'orange',
    name: 'Culinary Orange',
    hex: '#ea580c',
    gradientFrom: 'from-orange-600 dark:from-orange-800',
    gradientTo: 'to-amber-600 dark:to-orange-950',
    accentBg: 'bg-orange-50 dark:bg-orange-950/40',
    accentText: 'text-orange-700 dark:text-orange-400',
    activeTabBg: 'bg-orange-100 dark:bg-orange-950/80',
    activeTabText: 'text-orange-800 dark:text-orange-300',
    badgeBg: 'bg-orange-600 dark:bg-orange-500',
    btnBg: 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800',
    btnHover: 'hover:bg-orange-50 dark:hover:bg-orange-950/30',
    borderLeft: 'border-l-orange-500 dark:border-l-orange-400',
    ringFocus: 'focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-950/40',
  },
  {
    id: 'emerald',
    name: 'Fresh Emerald',
    hex: '#15803d',
    gradientFrom: 'from-emerald-700 dark:from-emerald-900',
    gradientTo: 'to-green-600 dark:to-slate-900',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    accentText: 'text-emerald-700 dark:text-emerald-400',
    activeTabBg: 'bg-emerald-100 dark:bg-emerald-950/80',
    activeTabText: 'text-emerald-800 dark:text-emerald-300',
    badgeBg: 'bg-emerald-600 dark:bg-emerald-500',
    btnBg: 'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900',
    btnHover: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
    borderLeft: 'border-l-emerald-600 dark:border-l-emerald-400',
    ringFocus: 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/40',
  },
  {
    id: 'blue',
    name: 'Classic Blue',
    hex: '#2563eb',
    gradientFrom: 'from-blue-600 dark:from-blue-900',
    gradientTo: 'to-indigo-600 dark:to-slate-900',
    accentBg: 'bg-blue-50 dark:bg-blue-950/40',
    accentText: 'text-blue-700 dark:text-blue-400',
    activeTabBg: 'bg-blue-100 dark:bg-blue-950/80',
    activeTabText: 'text-blue-800 dark:text-blue-300',
    badgeBg: 'bg-blue-600 dark:bg-blue-500',
    btnBg: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    btnHover: 'hover:bg-blue-50 dark:hover:bg-slate-700/60',
    borderLeft: 'border-l-blue-600 dark:border-l-blue-400',
    ringFocus: 'focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/40',
  },
  {
    id: 'red',
    name: 'Chef Crimson',
    hex: '#dc2626',
    gradientFrom: 'from-red-600 dark:from-red-900',
    gradientTo: 'to-rose-600 dark:to-slate-900',
    accentBg: 'bg-red-50 dark:bg-red-950/40',
    accentText: 'text-red-700 dark:text-red-400',
    activeTabBg: 'bg-red-100 dark:bg-red-950/80',
    activeTabText: 'text-red-800 dark:text-red-300',
    badgeBg: 'bg-red-600 dark:bg-red-500',
    btnBg: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    btnHover: 'hover:bg-red-50 dark:hover:bg-red-950/30',
    borderLeft: 'border-l-red-600 dark:border-l-red-400',
    ringFocus: 'focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/40',
  },
  {
    id: 'purple',
    name: 'Royal Violet',
    hex: '#7c3aed',
    gradientFrom: 'from-purple-600 dark:from-purple-900',
    gradientTo: 'to-indigo-600 dark:to-slate-900',
    accentBg: 'bg-purple-50 dark:bg-purple-950/40',
    accentText: 'text-purple-700 dark:text-purple-400',
    activeTabBg: 'bg-purple-100 dark:bg-purple-950/80',
    activeTabText: 'text-purple-800 dark:text-purple-300',
    badgeBg: 'bg-purple-600 dark:bg-purple-500',
    btnBg: 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800',
    btnHover: 'hover:bg-purple-50 dark:hover:bg-slate-700/60',
    borderLeft: 'border-l-purple-600 dark:border-l-purple-400',
    ringFocus: 'focus:border-purple-500 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-950/40',
  },
  {
    id: 'slate',
    name: 'Modern Charcoal',
    hex: '#334155',
    gradientFrom: 'from-slate-700 dark:from-slate-800',
    gradientTo: 'to-slate-900 dark:to-slate-950',
    accentBg: 'bg-slate-100 dark:bg-slate-800',
    accentText: 'text-slate-800 dark:text-slate-200',
    activeTabBg: 'bg-slate-200 dark:bg-slate-800',
    activeTabText: 'text-slate-900 dark:text-white',
    badgeBg: 'bg-slate-700 dark:bg-slate-600',
    btnBg: 'bg-slate-800 text-white hover:bg-black',
    btnHover: 'hover:bg-slate-100 dark:hover:bg-slate-800',
    borderLeft: 'border-l-slate-700 dark:border-l-slate-500',
    ringFocus: 'focus:border-slate-500 focus:ring-2 focus:ring-slate-100 dark:focus:ring-slate-800',
  },
];

export const DEFAULT_COLOR_THEME = COLOR_THEMES[0]; // Culinary Orange is default
