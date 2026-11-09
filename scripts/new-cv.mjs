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

async function chiediData(domanda, facoltativa = false) {
  for (;;) {
    const r = await chiedi(domanda);
    if (!r && facoltativa) return null;
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
  const al = await chiediData('Al (AAAA-MM, invio se ancora in corso)', true);
  const descrizione = await chiedi('Descrizione breve (invio per saltare)');
  const dettagliTesto = await chiedi('Dettagli separati da ";" (es. "Classe di concorso A041; 25 ore")');
  const dettagli = dettagliTesto.split(';').map((s) => s.trim()).filter(Boolean);

  const base = slugify(`${sezione}-${titolo}`).slice(0, 60);
  let nome = base;
  for (let i = 2; existsSync(join(DIR, `${nome}.yaml`)); i++) nome = `${base}-${i}`;

  const righe = [
    `sezione: ${sezione}`,
    `titolo: ${yamlString(titolo)}`,
    `ente: ${yamlString(ente)}`,
    luogo && `luogo: ${yamlString(luogo)}`,
    `dal: ${dal}`,
    al && `al: ${al}`,
    descrizione && `descrizione: ${yamlString(descrizione)}`,
    dettagli.length && `dettagli: [${dettagli.map(yamlString).join(', ')}]`
  ].filter(Boolean);

  mkdirSync(DIR, { recursive: true });
  writeFileSync(join(DIR, `${nome}.yaml`), righe.join('\n') + '\n', 'utf8');
  console.log(`\n✔ Creato src/content/curriculum/${nome}.yaml`);
} catch (e) {
  console.error(`✘ ${e.message}`);
  process.exitCode = 1;
} finally {
  chiudi();
}
