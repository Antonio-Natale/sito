#!/usr/bin/env node
// Aggiunge una voce al curriculum in src/content/curriculum/.
// Uso: npm run new:cv

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chiedi, chiudi, ROOT, scegli, slugify, yamlString } from './lib-cli.mjs';

const DIR = join(ROOT, 'src', 'content', 'curriculum');
const SEZIONI = [
  { valore: 'insegnamento', etichetta: 'Esperienze di insegnamento' },
  { valore: 'incarichi', etichetta: 'Incarichi scolastici' },
  { valore: 'titoli', etichetta: 'Titoli di studio' },
  { valore: 'formazione', etichetta: 'Formazione e aggiornamento' },
  { valore: 'certificazioni', etichetta: 'Certificazioni' },
  { valore: 'lavoro', etichetta: 'Altre esperienze lavorative' },
  { valore: 'pubblicazioni', etichetta: 'Pubblicazioni e convegni' }
];

// Accetta AAAA, AAAA-MM o AAAA-MM-GG e restituisce AAAA-MM-GG
function normalizzaData(s) {
  const m = s.trim().match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/);
  if (!m) return null;
  const [, a, mm = '1', gg = '1'] = m;
  return `${a}-${mm.padStart(2, '0')}-${gg.padStart(2, '0')}`;
}

async function chiediData(domanda, facoltativa = false, uguale = null) {
  for (;;) {
    const r = await chiedi(domanda);
    if (!r && facoltativa) return null;
    if (r === '=' && uguale) return uguale;
    const d = normalizzaData(r);
    if (d) return d;
    console.log('  Formato non valido: usa AAAA, AAAA-MM oppure AAAA-MM-GG.');
  }
}

try {
  const sezione = await scegli('Sezione', SEZIONI);
  let titolo = '';
  while (!titolo) titolo = await chiedi('Titolo (es. "Docente di Informatica", "Corso su…")');
  let ente = '';
  while (!ente) ente = await chiedi('Ente / scuola / università');
  const luogo = await chiedi('Luogo (invio per saltare)');
  const dal = await chiediData('Dal (AAAA-MM)');
  const al = await chiediData('Al (AAAA-MM; "=" se è una data sola, es. un titolo; invio se ancora in corso)', true, dal);
  const descrizione = await chiedi('Descrizione breve (invio per saltare)');
  const dettagliTesto = await chiedi('Dettagli separati da ";" (es. "Classe di concorso A041; 25 ore")');
  const dettagli = dettagliTesto.split(';').map((s) => s.trim()).filter(Boolean);
  let autori = [];
  let doi = '';
  if (sezione === 'pubblicazioni') {
    const autoriTesto = await chiedi('Autori separati da ";" (invio per saltare)');
    autori = autoriTesto.split(';').map((s) => s.trim()).filter(Boolean);
    doi = await chiedi('DOI, es. 10.1234/abcd (invio per saltare)');
  }
  const bozza = (await chiedi('Salvare come bozza? (s/n)', 'n')).toLowerCase().startsWith('s');

  const base = slugify(`${sezione}-${titolo}`).slice(0, 60);
  let nome = base;
  for (let i = 2; existsSync(join(DIR, `${nome}.yaml`)); i++) nome = `${base}-${i}`;

  // campo facoltativo: scritto se c'è un valore, altrimenti lasciato come esempio commentato
  const opz = (chiave, valore, esempio) => (valore ? `${chiave}: ${valore}` : `# ${chiave}: ${esempio}`);
  const lista = (chiave, valori, esempi) =>
    valori.length
      ? [`${chiave}:`, ...valori.map((v) => `  - ${yamlString(v)}`)].join('\n')
      : [`# ${chiave}:`, ...esempi.map((v) => `#   - ${v}`)].join('\n');

  const contenuto = `# ── Voce del curriculum ────────────────────────────────────────────────
# Le righe che iniziano con # sono commenti: il sito le ignora.
# Per usare un campo commentato togli il # (e lo spazio dopo) e cambia il valore.
# Rispetta i rientri (spazi, non tabulazioni) e i due punti dopo ogni campo.

# SEZIONE — valori ammessi: ${SEZIONI.map((s) => s.valore).join(', ')}
sezione: ${sezione}
titolo: ${yamlString(titolo)}
ente: ${yamlString(ente)}
${opz('luogo', luogo && yamlString(luogo), 'Città')}

# DATE — formato AAAA-MM-GG. Sul sito compaiono come mese e anno (es. "set 2024 – in corso").
#  - "al" assente        → "in corso"
#  - "al" uguale a "dal" → una data sola (titoli, certificazioni)
dal: ${dal}
${opz('al', al, dal)}

${opz('descrizione', descrizione && yamlString(descrizione), 'Una frase che spiega di cosa si tratta')}

# DETTAGLI — brevi informazioni mostrate come etichette (classe di concorso, ore, voto, livello…)
${lista('dettagli', dettagli, ['Classe di concorso A041', '25 ore'])}

# LINK — indirizzo esterno; rende cliccabile il titolo
# url: https://www.esempio.it

# ALLEGATO — file in public/ (es. attestato). I PDF si leggono nella pagina
# (pannello «Visualizza documento») e non si scaricano.
# allegato: documenti/curriculum/${nome}.pdf
${
  sezione === 'pubblicazioni'
    ? `
# SOLO PER LE PUBBLICAZIONI
${lista('autori', autori, ['Cognome N.', 'Cognome N.'])}
${opz('doi', doi && yamlString(doi), '10.1234/abcd')}
`
    : ''
}
# BOZZA — true = bozza, visibile solo con "npm run dev"; false = pubblicata
draft: ${bozza}
`;

  mkdirSync(DIR, { recursive: true });
  writeFileSync(join(DIR, `${nome}.yaml`), contenuto, 'utf8');
  console.log(`\n✔ Creato src/content/curriculum/${nome}.yaml`);
  console.log('  Apri il file: i campi facoltativi e le istruzioni sono nei commenti.');
  if (bozza) console.log('  (bozza: visibile solo con "npm run dev"; imposta draft: false per pubblicarla)');
} catch (e) {
  console.error(`✘ ${e.message}`);
  process.exitCode = 1;
} finally {
  chiudi();
}
