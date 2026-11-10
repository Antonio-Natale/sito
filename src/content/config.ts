import { defineCollection, z } from 'astro:content';
import { MATERIE } from '../data/site';

const slugMaterie = MATERIE.map((m) => m.slug) as [string, ...string[]];

// Materiali didattici, organizzati per materia → argomento.
const materiali = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    materia: z.enum(slugMaterie),
    argomento: z.string(),
    // anni di corso consigliati (1–5), facoltativo
    classi: z.array(z.number().int().min(1).max(5)).default([]),
    data: z.coerce.date(),
    tipo: z
      .enum([
        'dispensa',
        'slide',
        'esercizi',
        'mappa',
        'recupero',
        'compiti',
        'simulazione',
        'laboratorio',
        'video',
        'altro'
      ])
      .default('dispensa'),
    tags: z.array(z.string()).default([]),
    // posizione dentro l'argomento (1, 2, 3…); senza "ordine" il materiale va dopo, dal più recente
    ordine: z.number().int().optional(),
    // file in public/ (percorso relativo, es. "documenti/scheda-1.pdf")
    // i PDF si leggono nella pagina; "scaricabile: true" mostra invece il link di download
    allegati: z
      .array(z.object({ nome: z.string(), file: z.string(), scaricabile: z.boolean().default(false) }))
      .default([]),
    // presentazione HTML in public/slides/<nome>/ (es. "slides/esempio/")
    slides: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

const progetti = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    data: z.coerce.date(),
    // scolastico = progetti con le classi; personale = applicazioni, siti e strumenti sviluppati da me
    ambito: z.enum(['scolastico', 'personale']).default('scolastico'),
    tipo: z
      .enum([
        'PCTO',
        'PTOF',
        'Erasmus+',
        'olimpiadi',
        'uscita didattica',
        'applicazione',
        'sito web',
        'strumento didattico',
        'altro'
      ])
      .default('altro'),
    annoScolastico: z.string().optional(), // es. "2025/26"
    materie: z.array(z.enum(slugMaterie)).default([]),
    stato: z.enum(['in corso', 'concluso']).default('in corso'),
    tecnologie: z.array(z.string()).default([]), // es. [Python, Android]
    tags: z.array(z.string()).default([]),
    link: z.string().url().optional(), // app, sito o pagina del progetto
    codice: z.string().url().optional(), // codice sorgente, es. repository GitHub
    inEvidenza: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

// Voci del curriculum: un file YAML per voce in src/content/curriculum/
export const SEZIONI_CV = [
  'insegnamento',
  'incarichi',
  'titoli',
  'formazione',
  'certificazioni',
  'lavoro',
  'pubblicazioni'
] as const;

const curriculum = defineCollection({
  type: 'data',
  schema: z.object({
    sezione: z.enum(SEZIONI_CV),
    titolo: z.string(),
    ente: z.string(),
    luogo: z.string().optional(),
    dal: z.coerce.date(),
    al: z.coerce.date().optional(), // assente = "in corso"
    descrizione: z.string().optional(),
    dettagli: z.array(z.string()).default([]), // es. classe di concorso, ore, voto, livello
    url: z.string().url().optional(),
    allegato: z.string().optional(), // percorso in public/
    // solo per le pubblicazioni
    autori: z.array(z.string()).optional(),
    doi: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = { materiali, progetti, curriculum };
