#!/usr/bin/env node
// Crea un nuovo materiale didattico in src/content/materiali/ (o in una sua sottocartella).
// Uso: npm run new:materiale
//      npm run new:materiale -- "Titolo del materiale"

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
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

// Aggiunge un argomento in fondo alla lista "argomenti" di una materia in src/data/site.ts
function aggiungiArgomento(slugMateria, argomento) {
  const file = join(ROOT, 'src', 'data', 'site.ts');
  const src = readFileSync(file, 'utf8');
  const inizioMaterie = src.indexOf('export const MATERIE');
  const inizio = src.indexOf(`slug: '${slugMateria}'`, inizioMaterie);
  if (inizioMaterie < 0 || inizio < 0) return false;
  const re = /argomenti:\s*\[([\s\S]*?)\]/g;
  re.lastIndex = inizio;
  const m = re.exec(src);
  // la lista trovata deve appartenere a questa materia, non a quella successiva
  const prossima = src.indexOf('slug:', inizio + 1);
  if (!m || (prossima >= 0 && m.index > prossima)) return false;
  const voci = [...m[1].matchAll(/'([^']*)'|"([^"]*)"/g)].map((x) => x[1] ?? x[2]);
  voci.push(argomento);
  const quota = (s) => (s.includes("'") ? JSON.stringify(s) : `'${s}'`);
  const nuovo = `argomenti: [${voci.map(quota).join(', ')}]`;
  writeFileSync(file, src.slice(0, m.index) + nuovo + src.slice(m.index + m[0].length), 'utf8');
  return true;
}

// Elenca le cartelle (e sottocartelle) dentro src/content/materiali, es. "informatica/reti"
function elencaCartelle(dir = DIR, prefisso = '') {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name, 'it'))
    .flatMap((d) => {
      const rel = prefisso ? `${prefisso}/${d.name}` : d.name;
      return [rel, ...elencaCartelle(join(dir, d.name), rel)];
    });
}

// Elenca tutti i file .md dei materiali, per evitare nomi doppi in cartelle diverse
function elencaSchede(dir = DIR, prefisso = '') {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const rel = prefisso ? `${prefisso}/${d.name}` : d.name;
    if (d.isDirectory()) return elencaSchede(join(dir, d.name), rel);
    return d.name.endsWith('.md') ? [rel] : [];
  });
}

// Chiede la cartella: una esistente, la principale o una nuova (es. "informatica/reti")
async function scegliCartella(materia) {
  const esistenti = elencaCartelle();
  const scelta = await scegli(
    'Cartella in cui salvare la scheda',
    [
      ...esistenti.map((c) => ({ valore: c, etichetta: c })),
      { valore: '.', etichetta: '(cartella principale)' },
      { valore: '', etichetta: 'Nuova cartella…' }
    ],
    esistenti.includes(materia) ? materia : undefined
  );
  if (scelta === '.') return '';
  if (scelta) return scelta;
  for (;;) {
    const testo = await chiedi('Nome della cartella (per una sottocartella usa /, es. informatica/reti)');
    const cartella = testo.split(/[\\/]+/).map(slugify).filter(Boolean).join('/');
    if (!cartella) continue;
    if (cartella !== testo.trim()) console.log(`  Nome adattato: ${cartella}`);
    if (esistenti.includes(cartella)) console.log('  La cartella esiste già: verrà usata quella.');
    return cartella;
  }
}

try {
  const materie = leggiMaterie();
  if (materie.length === 0) throw new Error('Nessuna materia trovata in src/data/site.ts (MATERIE).');

  let titolo = process.argv.slice(2).join(' ').trim();
  // il nome del file deriva dal titolo e deve essere unico in tutte le cartelle
  for (;;) {
    while (!titolo) titolo = await chiedi('Titolo');
    const doppione = elencaSchede().find((f) => f.split('/').pop() === `${slugify(titolo)}.md`);
    if (!doppione) break;
    console.log(`  Esiste già un materiale con questo nome: src/content/materiali/${doppione}. Scegli un titolo diverso.`);
    titolo = '';
  }

  const descrizione = await chiedi('Descrizione breve', titolo);
  const materia = await scegli('Materia', materie.map((m) => ({ valore: m.slug, etichetta: m.nome })));
  const cartella = await scegliCartella(materia);
  const { argomenti } = materie.find((m) => m.slug === materia);
  let argomento = '';
  if (argomenti.length) {
    argomento = await scegli('Argomento', [
      ...argomenti.map((a) => ({ valore: a, etichetta: a })),
      { valore: '', etichetta: 'Nuovo argomento…' }
    ]);
  }
  while (!argomento) argomento = await chiedi('Argomento (es. "Le reti di computer")');
  // se il nuovo argomento esiste già (a parte maiuscole/minuscole) si usa quello esistente
  const esistente = argomenti.find((a) => a.toLowerCase() === argomento.toLowerCase());
  if (esistente) argomento = esistente;
  const nuovoArgomento = !esistente;
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
  // allegati e immagini: public/documenti/<argomento>/<nome-materiale>/
  const docs = `documenti/${slugify(argomento)}/${slug}`;
  const relFile = cartella ? `${cartella}/${slug}.md` : `${slug}.md`;
  const file = join(DIR, ...relFile.split('/'));

  const oggi = new Date().toISOString().slice(0, 10);
  const contenuto = `---
# ── Intestazione del materiale ─────────────────────────────────────────
# Le righe che iniziano con # sono commenti: il sito le ignora.
# Rispetta i rientri (spazi, non tabulazioni) e i due punti dopo ogni campo.
title: ${yamlString(titolo)}
description: ${yamlString(descrizione)}
materia: ${materia}
# argomento: scritto esattamente come in "argomenti" di src/data/site.ts
argomento: ${yamlString(argomento)}
# classi: anni da 1 a 5, es. [3, 4]; [] = adatto a tutte le classi
classi: [${classi.join(', ')}]
data: ${oggi}
# tipo: ${TIPI.join(', ')}
tipo: ${tipo}
# ordine: posizione dentro l'argomento (1, 2, 3…); senza, si ordina per data
${ordine !== undefined ? '' : '# '}ordine: ${ordine ?? 1}
# tags: parole chiave per la ricerca, es. [ripasso, DSA]
tags: []

# ALLEGATI — per aggiungere PDF, togli il # SOLO dalle righe con "allegati",
# "- nome" e "file". I file vanno in public/${docs}/
# I PDF si leggono nella pagina e non si scaricano; per permettere il download
# di un file aggiungi sotto il suo "file" la riga "    scaricabile: true".
# allegati:
#   - nome: Presentazione
#     file: ${docs}/nome-file.pdf
#   - nome: Scheda di esercizi
#     file: ${docs}/altro-file.pdf

# SLIDE HTML (cartella in public/slides/${slug}/ con dentro index.html):
# slides: slides/${slug}/

# draft: true = bozza, visibile solo con "npm run dev"; false = pubblicato
draft: ${bozza}
---

Scrivi qui il contenuto del materiale e cancella gli esempi qui sotto che non ti servono.

## Un titolo di sezione

Testo normale, con parole in **grassetto** e in *corsivo*.

- un elenco puntato
- un altro punto

1. un elenco numerato
2. secondo passo

| Termine | Significato |
| ------- | ----------- |
| Esempio | Spiegazione breve |

> Un riquadro di citazione o di avviso.

<!--
IMMAGINE: metti il file in public/${docs}/, poi copia la riga qui sotto
fuori da questo commento e cambia il nome del file. Il percorso deve iniziare con /sito/
(non usare ../ : il sito cercherebbe l'immagine nel posto sbagliato e non si pubblicherebbe).

![Descrizione dell'immagine](/sito/${docs}/immagine.png)
-->

Link a una pagina esterna: [testo del link](https://www.esempio.it)

Link a un altro materiale del sito: [titolo](/sito/didattica/nome-altro-materiale/)
`;

  // se la cartella esiste già viene usata così com'è, altrimenti viene creata
  const dirScheda = join(DIR, ...(cartella ? cartella.split('/') : []));
  if (!existsSync(dirScheda)) mkdirSync(dirScheda, { recursive: true });
  writeFileSync(file, contenuto, 'utf8');
  const dirAllegati = join(ROOT, 'public', ...docs.split('/'));
  if (!existsSync(dirAllegati)) mkdirSync(dirAllegati, { recursive: true });

  console.log(`\n✔ Creato src/content/materiali/${relFile}`);
  console.log(`✔ Cartella allegati: public/${docs}/`);
  if (nuovoArgomento) {
    if (aggiungiArgomento(materia, argomento))
      console.log(`✔ Argomento "${argomento}" aggiunto in src/data/site.ts (in fondo: sposta la voce per cambiarne l'ordine)`);
    else console.log(`  Attenzione: non sono riuscito ad aggiungere "${argomento}" in src/data/site.ts, aggiungilo a mano.`);
  }
  console.log(`  Indirizzo della pagina: /sito/didattica/${relFile.replace(/\.md$/, '')}/`);
  console.log('  Apri il file: le istruzioni per allegati, immagini e link sono nei commenti.');
  if (bozza) console.log('  (bozza: visibile solo con "npm run dev"; imposta draft: false per pubblicarlo)');
} catch (e) {
  console.error(`✘ ${e.message}`);
  process.exitCode = 1;
} finally {
  chiudi();
}
