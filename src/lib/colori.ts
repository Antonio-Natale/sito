import type { ColoreMateria } from '@/data/site';
import { getMateria } from '@/data/site';

// Classi complete (non generate dinamicamente) così Tailwind le include nella build.
const COLORI: Record<ColoreMateria, { chip: string; bordo: string; punto: string }> = {
  blu: {
    chip: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    bordo: 'border-l-blue-500',
    punto: 'bg-blue-500'
  },
  verde: {
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    bordo: 'border-l-emerald-500',
    punto: 'bg-emerald-500'
  },
  ambra: {
    chip: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    bordo: 'border-l-amber-500',
    punto: 'bg-amber-500'
  },
  rosa: {
    chip: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    bordo: 'border-l-rose-500',
    punto: 'bg-rose-500'
  },
  viola: {
    chip: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
    bordo: 'border-l-violet-500',
    punto: 'bg-violet-500'
  },
  ciano: {
    chip: 'bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
    bordo: 'border-l-cyan-500',
    punto: 'bg-cyan-500'
  }
};

export function coloreMateria(slug: string) {
  const m = getMateria(slug);
  return COLORI[m?.colore ?? 'blu'];
}
