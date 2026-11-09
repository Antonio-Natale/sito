#!/usr/bin/env node
// Crea un nuovo materiale didattico in src/content/materiali/.
// Uso: npm run new:materiale
//      npm run new:materiale -- "Titolo del materiale"

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chiedi, chiudi, ROOT, scegli, slugify, yamlString } from './lib-cli.mjs';

const DIR = join(ROOT, 'src', 'content', 'materiali');
const TIPI = ['dispensa', 'slide', 'esercizi', 'mappa', 'recupero', 'compiti', 'simulazione', 'laboratorio', 'video', 'altro'];

// Legge le materie da src/data/site.ts (coppie slug/nome dentro MATERIE)
function leggiMaterie() {
  const src = readFileSync(join(ROOT, 'src', 'data', 'site.ts'), 'utf8');
  const blocco = src.slice(src.indexOf('export const MATERIE'));
  const materie = [];
  const re = /slug:\s*['"]([^'"]+)['"],\s*nome:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(blocco))) materie.push({ slug: m[1], nome: m[2] });
  // argomenti ordinati di ogni materia (campo "argomenti: [...]" dopo lo slug)
  for (let i = 0; i < materie.length; i++) {
    const inizio = blocco.indexOf(`slug: '${materie[i].slug}'`);
    const fine = i + 1 < materie.length ? blocco.indexOf(`slug: '${materie[i + 1].slug}'`) : blocco.length;
    const lista = /argomenti:\s*\[([\s\S]*?)\]/.exec(blocco.slice(inizio, fine));
    materie[i].argomenti = lista ? [...lista[1].matchAll(/'([^']*)'|"([^"]*)"/g)].map((x) => x[1] ?? x[2]) : [];
  }
  return materie;
}

try {
  const materie = leggiMaterie();
  if (materie.length === 0) throw new Error('Nessuna materia trovata in src/data/site.ts (MATERIE).');

  let titolo = process.argv.slice(2).join(' ').trim();
  while (!titolo) titolo = await chiedi('Titolo');

  const descrizione = await chiedi('Descrizione breve', titolo);
  const materia = await scegli('Materia', materie.map((m) => ({ valore: m.slug, etichetta: m.nome })));
  const { argomenti } = materie.find((m) => m.slug === materia);
  let argomento = '';
  if (argomenti.length) {
    argomento = await scegli('Argomento', [
      ...argomenti.map((a) => ({ valore: a, etichetta: a })),
      { valore: '', etichetta: 'Nuovo argomento…' }
    ]);
  }
  while (!argomento) argomento = await chiedi('Argomento (es. "Le reti di computer")');
  if (!argomenti.includes(argomento))
    console.log(`  Nota: aggiungi "${argomento}" ad "argomenti" in src/data/site.ts per sceglierne la posizione.`);
  const ordineTesto = await chiedi("Posizione dentro l'argomento: 1, 2, 3… (invio per ordinare per data)");
  const ordine = /^\d+$/.test(ordineTesto) ? Number(ordineTesto) : undefined;
  const classiTesto = await chiedi('Classi consigliate, anni da 1 a 5 separati da virgola (invio per nessuna)');
  const classi = classiTesto
    .split(/[ ,;]+/)
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 5);
  const tipo = await scegli('Tipo', TIPI.map((t) => ({ valore: t, etichetta: t })), 'dispensa');
  const bozza = (await chiedi('Salvare come bozza? (s/n)', 's')).toLowerCase().startsWith('s');

  const slug = slugify(titolo);
  const file = join(DIR, `${slug}.md`);
  if (existsSync(file)) throw new Error(`Esiste già: ${file}`);

  const oggi = new Date().toISOString().slice(0, 10);
  const contenuto = `---
title: ${yamlString(titolo)}
description: ${yamlString(descrizione)}
materia: ${materia}
argomento: ${yamlString(argomento)}
classi: [${classi.join(', ')}]
data: ${oggi}
tipo: ${tipo}
${ordine !== undefined ? `ordine: ${ordine}\n` : ''}tags: []
allegati: []
#  - nome: Scheda di esercizi
#    file: documenti/${slug}/scheda.pdf
# slides: slides/${slug}/
draft: ${bozza}
---

Scrivi qui il contenuto del materiale.
`;

  mkdirSync(DIR, { recursive: true });
  writeFileSync(file, contenuto, 'utf8');
  mkdirSync(join(ROOT, 'public', 'documenti', slug), { recursive: true });

  console.log(`\n✔ Creato src/content/materiali/${slug}.md`);
  console.log(`✔ Cartella allegati: public/documenti/${slug}/`);
  if (bozza) console.log('  (bozza: visibile solo con "npm run dev"; imposta draft: false per pubblicarlo)');
} catch (e) {
  console.error(`✘ ${e.message}`);
  process.exitCode = 1;
} finally {
  chiudi();
}
