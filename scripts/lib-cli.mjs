// Funzioni comuni agli script da riga di comando.
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const yamlString = (s) => JSON.stringify(s);

const rl = createInterface({ input, output, terminal: Boolean(input.isTTY) });
// le righe vengono messe in coda: funziona sia digitando sia con input da file/pipe
const righe = rl[Symbol.asyncIterator]();

export async function chiedi(domanda, predefinito = '') {
  output.write(predefinito ? `${domanda} [${predefinito}]: ` : `${domanda}: `);
  const { value, done } = await righe.next();
  if (done) throw new Error('Input terminato prima di completare le domande.');
  if (!input.isTTY) output.write(`${value}\n`);
  return value.trim() || predefinito;
}

/** Mostra un elenco numerato e restituisce il valore scelto. */
export async function scegli(domanda, opzioni, predefinito) {
  console.log(`\n${domanda}:`);
  opzioni.forEach((o, i) => console.log(`  ${i + 1}. ${o.etichetta}`));
  const iDef = predefinito ? opzioni.findIndex((o) => o.valore === predefinito) + 1 : 0;
  for (;;) {
    const r = await chiedi('Numero', iDef ? String(iDef) : '');
    const n = Number(r);
    if (Number.isInteger(n) && n >= 1 && n <= opzioni.length) return opzioni[n - 1].valore;
    console.log(`  Scegli un numero da 1 a ${opzioni.length}.`);
  }
}

export function chiudi() {
  rl.close();
}
