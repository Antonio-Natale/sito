import type { CollectionEntry } from 'astro:content';
import { MATERIE, getMateria } from '@/data/site';
import { byDateDesc } from './utils';

type Materiale = CollectionEntry<'materiali'>;

/**
 * Confronta due argomenti della stessa materia: prima quelli elencati in MATERIE[].argomenti
 * (nell'ordine scritto lì), poi gli altri in ordine alfabetico.
 */
export function confrontaArgomenti(materia: string, a: string, b: string): number {
  const elenco: readonly string[] = getMateria(materia)?.argomenti ?? [];
  const pos = (x: string) => {
    const i = elenco.indexOf(x);
    return i === -1 ? Infinity : i;
  };
  return pos(a) - pos(b) || (pos(a) === Infinity ? a.localeCompare(b, 'it') : 0);
}

/** Ordine dentro un argomento: prima per "ordine" (1, 2, 3…), poi gli altri dal più recente. */
export function confrontaMateriali(a: Materiale, b: Materiale): number {
  const oa = a.data.ordine ?? Infinity;
  const ob = b.data.ordine ?? Infinity;
  if (oa !== ob) return oa - ob;
  return byDateDesc(a, b);
}

/** Raggruppa per argomento (ordine di MATERIE[].argomenti, poi alfabetico). */
export function perArgomento(materiali: Materiale[]): [string, Materiale[]][] {
  const mappa = new Map<string, Materiale[]>();
  for (const m of materiali) {
    const lista = mappa.get(m.data.argomento) ?? [];
    lista.push(m);
    mappa.set(m.data.argomento, lista);
  }
  return [...mappa.entries()]
    .sort(([a, la], [b]) => confrontaArgomenti(la[0].data.materia, a, b))
    .map(([arg, lista]) => [arg, lista.sort(confrontaMateriali)]);
}

/** Raggruppa per materia (nell'ordine di MATERIE) e poi per argomento. */
export function perMateria(materiali: Materiale[]) {
  return MATERIE.map((materia) => ({
    materia,
    argomenti: perArgomento(materiali.filter((m) => m.data.materia === materia.slug))
  })).filter((g) => g.argomenti.length > 0);
}

/** Coppie materia/argomento, tipi e classi presenti, per popolare i filtri. */
export function opzioniFiltri(materiali: Materiale[]) {
  const visti = new Set<string>();
  const argomenti: { materia: string; argomento: string }[] = [];
  for (const m of materiali) {
    const chiave = `${m.data.materia}::${m.data.argomento}`;
    if (visti.has(chiave)) continue;
    visti.add(chiave);
    argomenti.push({ materia: m.data.materia, argomento: m.data.argomento });
  }
  // nell'ordine delle materie, poi nell'ordine degli argomenti scelto in site.ts
  const posMateria = (slug: string) => MATERIE.findIndex((m) => m.slug === slug);
  argomenti.sort(
    (a, b) => posMateria(a.materia) - posMateria(b.materia) || confrontaArgomenti(a.materia, a.argomento, b.argomento)
  );
  const tipi = [...new Set(materiali.map((m) => m.data.tipo))].sort();
  const classi = [...new Set(materiali.flatMap((m) => m.data.classi))].sort((a, b) => a - b);
  return { argomenti, tipi, classi };
}

/** Attributi data-* letti dal componente Filtri. */
export function attributiFiltro(m: Materiale): Record<string, string> {
  return {
    'data-item': '',
    'data-materia': m.data.materia,
    'data-argomento': m.data.argomento,
    'data-tipo': m.data.tipo,
    // classi separate da spazio (vuoto = adatto a tutte le classi)
    'data-classi': m.data.classi.join(' '),
    'data-testo': [m.data.title, m.data.description, m.data.argomento, ...m.data.tags].join(' ')
  };
}
