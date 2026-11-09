import { getCollection, type CollectionKey } from 'astro:content';

/**
 * Antepone il "base path" del sito (es. /nome-repo) a un percorso interno.
 * Usare SEMPRE per link interni e file in public/, così il sito funziona
 * sia su GitHub Pages (con sottocartella) sia su un dominio personale.
 */
export function withBase(path = '/'): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const meseAnnoFormatter = new Intl.DateTimeFormat('it-IT', { month: 'short', year: 'numeric' });

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

/** Periodo per il curriculum, es. "set 2021 – in corso" oppure "2019 – 2020". */
export function formatPeriodo(dal: Date, al?: Date): string {
  const f = (d: Date) => meseAnnoFormatter.format(d).replace('.', '');
  if (!al) return `${f(dal)} – in corso`;
  if (dal.getTime() === al.getTime()) return f(dal);
  return `${f(dal)} – ${f(al)}`;
}

/** Restituisce gli elementi pubblicati (le bozze sono visibili solo in sviluppo). */
export async function getPublished<C extends CollectionKey>(collection: C) {
  return getCollection(collection, (entry) =>
    import.meta.env.PROD ? !(entry.data as { draft?: boolean }).draft : true
  );
}

/** Ordina per data decrescente. */
export function byDateDesc<T extends { data: { data: Date } }>(a: T, b: T): number {
  return b.data.data.getTime() - a.data.data.getTime();
}

/** Trasforma un testo in uno slug per URL e ancore. */
export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const ETICHETTE_TIPO: Record<string, string> = {
  dispensa: 'Dispensa',
  slide: 'Slide',
  esercizi: 'Esercizi',
  mappa: 'Mappa concettuale',
  recupero: 'Recupero',
  compiti: 'Compiti',
  simulazione: 'Simulazione di verifica',
  laboratorio: 'Laboratorio',
  video: 'Video',
  altro: 'Altro'
};

/** "3ª, 4ª" a partire da [3, 4]. */
export function formatClassi(classi: number[]): string {
  return classi.map((c) => `${c}ª`).join(', ');
}
