// Dati generali del sito: modificare qui nome, ruolo, materie, ricevimento e menu.

export const SITE = {
  titolo: 'Prof. Antonio Natale',
  nome: 'Antonio Natale',
  ruolo: 'Docente di scuola secondaria di secondo grado',
  istituto: 'Istituto Statale di Istruzione Superiore Luigi Einaudi',
  descrizione:
    'Materiali didattici e curriculum. Uno spazio per studenti, famiglie e colleghi.',
  // Usare l'email istituzionale: il sito è pubblico.
  email: 'nome.cognome@scuola.example.it',
  lingua: 'it'
} as const;

// Colori disponibili per le materie (vedi src/lib/colori.ts)
export type ColoreMateria = 'blu' | 'verde' | 'ambra' | 'rosa' | 'viola' | 'ciano';

// Materie insegnate: lo "slug" si usa nei file dei materiali (campo "materia").
// "argomenti": ordine in cui gli argomenti compaiono nel sito (scrivere i nomi esattamente
// come nel campo "argomento" dei materiali). Quelli non elencati vanno in fondo, in ordine alfabetico.
export const MATERIE = [
  {
    slug: 'informatica',
    nome: 'Informatica',
    descrizione: 'Algoritmi, programmazione, basi di dati e sviluppo del software.',
    colore: 'blu',
    argomenti: ['Sicurezza informatica', 'Argomento A', 'Argomento B']
  },
  {
    slug: 'tpsc',
    nome: 'TPSC',
    descrizione: 'Breve descrizione della materia.',
    colore: 'verde',
    argomenti: ['Argomento C']
  }
] as const satisfies readonly {
  slug: string;
  nome: string;
  descrizione: string;
  colore: ColoreMateria;
  argomenti: readonly string[];
}[];

export type SlugMateria = (typeof MATERIE)[number]['slug'];

export function getMateria(slug: string) {
  return MATERIE.find((m) => m.slug === slug);
}

export const RICEVIMENTO = {
  orari: [
    { giorno: 'Lunedì', ora: '10:00 – 11:00', note: 'In presenza' },
    { giorno: 'Giovedì', ora: '15:00 – 16:00', note: 'Online, su prenotazione' }
  ],
  prenotazione:
    'I colloqui si prenotano dal registro elettronico, nella sezione dedicata ai colloqui individuali.',
  linkRegistro: 'https://www.example.com/registro-elettronico',
  note: 'Durante il periodo degli scrutini il ricevimento è sospeso.'
};

// Sezione Progetti: false = nascosta (menu, home e pagine non vengono generate).
// Per riattivarla basta scrivere true.
export const MOSTRA_PROGETTI = false;

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Didattica', href: '/didattica/' },
  { label: 'Progetti', href: '/progetti/' },
  { label: 'Curriculum', href: '/curriculum/' },
  { label: 'Chi sono', href: '/chi-sono/' },
  { label: 'Ricevimento', href: '/ricevimento/' }
].filter((item) => MOSTRA_PROGETTI || item.href !== '/progetti/');

export const SOCIAL: { label: string; href: string }[] = [
  // { label: 'LinkedIn', href: 'https://www.linkedin.com/in/...' },
  // { label: 'GitHub', href: 'https://github.com/tuo-username' }
];
