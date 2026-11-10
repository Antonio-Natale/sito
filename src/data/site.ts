// Dati generali del sito: modificare qui nome, ruolo, materie, ricevimento e menu.

export const SITE = {
  titolo: 'Prof. Antonio Natale',
  nome: 'Antonio Natale',
  ruolo: 'Docente tecnico-pratico di Informatica',
  istituto: 'Istituto Statale di Istruzione Superiore Luigi Einaudi',
  descrizione:
    'Materiali didattici e curriculum. Uno spazio per studenti, famiglie e colleghi.',
  // Usare l'email istituzionale: il sito è pubblico.
  email: 'antonio.natale@isiseinaudi.it',
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
    nome: 'Laboratorio di Informatica',
    descrizione:
      "Attività di laboratorio di informatica negli indirizzi professionali Servizi per la sanità e l'assistenza sociale e Servizi commerciali.",
    colore: 'blu',
    argomenti: ['Sicurezza informatica', 'Argomento A', 'Argomento B']
  },
  {
    slug: 'tpsc',
    nome: 'Laboratorio di TPSC',
    descrizione:
      'Laboratorio di Tecniche professionali per i servizi commerciali, in compresenza con il docente della disciplina.',
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
    { giorno: 'Lunedì', ora: '8:00 – 9:00', note: 'Online, su prenotazione' }
  ],
  prenotazione:
    'I colloqui si prenotano dal registro elettronico, nella sezione dedicata ai colloqui individuali.',
  linkRegistro: 'https://www.portaleargo.it/',
  note: "Per esigenze particolari è possibile concordare un appuntamento scrivendo all'indirizzo email istituzionale."
};

// Sezione Progetti: false = nascosta (menu, home e pagine non vengono generate).
// Per riattivarla basta scrivere true.
export const MOSTRA_PROGETTI = true;

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
