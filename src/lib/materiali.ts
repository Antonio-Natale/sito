import type { CollectionEntry } from 'astro:content';
import { MATERIE } from '@/data/site';
import { byDateDesc } from './utils';

type Materiale = CollectionEntry<'materiali'>;

/** Raggruppa per argomento (ordine alfabetico), materiali dal più recente. */
export function perArgomento(materiali: Materiale[]): [string, Materiale[]][] {
  const mappa = new Map<string, Materiale[]>();
  for (const m of materiali) {
    const lista = mappa.get(m.data.argomento) ?? [];
    lista.push(m);
    mappa.set(m.data.argomento, lista);
  }
  return [...mappa.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'it'))
    .map(([arg, lista]) => [arg, lista.sort(byDateDesc)]);
}

/** Raggruppa per materia (nell'ordine di MATERIE) e poi per argomento. */
export function perMateria(materiali: Materiale[]) {
  return MATERIE.map((materia) => ({
    materia,
    argomenti: perArgomento(materiali.filter((m) => m.data.materia === materia.slug))
  })).filter((g) => g.argomenti.length > 0);
}

/** Coppie materia/argomento e tipi presenti, per popolare i filtri. */
export function opzioniFiltri(materiali: Materiale[]) {
  const visti = new Set<string>();
  const argomenti: { materia: string; argomento: string }[] = [];
  for (const m of materiali) {
    const chiave = `${m.data.materia}::${m.data.argomento}`;
    if (visti.has(chiave)) continue;
    visti.add(chiave);
    argomenti.push({ materia: m.data.materia, argomento: m.data.argomento });
  }
  argomenti.sort((a, b) => a.argomento.localeCompare(b.argomento, 'it'));
  const tipi = [...new Set(materiali.map((m) => m.data.tipo))].sort();
  return { argomenti, tipi };
}

/** Attributi data-* letti dal componente Filtri. */
export function attributiFiltro(m: Materiale): Record<string, string> {
  return {
    'data-item': '',
    'data-materia': m.data.materia,
    'data-argomento': m.data.argomento,
    'data-tipo': m.data.tipo,
    'data-testo': [m.data.title, m.data.description, m.data.argomento, ...m.data.tags].join(' ')
  };
}
