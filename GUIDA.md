# Guida all'aggiornamento del sito

Sito pubblicato: **https://antonio-natale.github.io/sito/**
Repository: **https://github.com/Antonio-Natale/sito**

Questa guida spiega come modificare il sito in autonomia: dati personali, curriculum,
materiali didattici, pubblicazione e soluzione dei problemi più comuni.

> Questo file non compare sul sito, ma il repository è pubblico: non scriverci dati privati.

---

## Indice

1. [Come funziona, in breve](#1-come-funziona-in-breve)
2. [Strumenti e prima configurazione](#2-strumenti-e-prima-configurazione)
3. [Il ciclo di lavoro](#3-il-ciclo-di-lavoro)
4. [Dove si trova ogni cosa](#4-dove-si-trova-ogni-cosa)
5. [Dati generali del sito](#5-dati-generali-del-sito)
6. [Pagina "Chi sono"](#6-pagina-chi-sono)
7. [Curriculum](#7-curriculum)
8. [Materiali didattici](#8-materiali-didattici)
9. [Allegati, immagini e slide](#9-allegati-immagini-e-slide)
10. [Sezione Progetti](#10-sezione-progetti)
11. [Scrivere in Markdown](#11-scrivere-in-markdown)
12. [Pubblicare le modifiche](#12-pubblicare-le-modifiche)
13. [Lavorare da un altro computer o dal browser](#13-lavorare-da-un-altro-computer-o-dal-browser)
14. [Errori comuni e soluzioni](#14-errori-comuni-e-soluzioni)
15. [Privacy: cosa non pubblicare](#15-privacy-cosa-non-pubblicare)
16. [Promemoria rapido](#16-promemoria-rapido)

---

## 1. Come funziona, in breve

- Il sito è fatto con **Astro**: i contenuti sono semplici file di testo (`.md`, `.yaml`, `.ts`)
  che Astro trasforma in pagine web.
- Il codice è su **GitHub**. Ogni volta che invii una modifica (*push*), GitHub ricostruisce
  e ripubblica il sito da solo in 1–2 minuti.
- Se una modifica contiene un errore, la pubblicazione si ferma e **online resta la versione
  precedente**: il sito non si rompe.

---

## 2. Strumenti e prima configurazione

Sul computer servono (sono già installati su questo PC):

| Strumento | A cosa serve | Download |
|---|---|---|
| **Node.js** | Avvia il sito in locale e lo costruisce | https://nodejs.org (versione LTS) |
| **Git** | Salva le versioni e le invia a GitHub | https://git-scm.com |
| **VS Code** (consigliato) | Editor per modificare i file, con terminale integrato | https://code.visualstudio.com |

**Aprire il progetto in VS Code:** File → Apri cartella → `Desktop\Sito Web`.
**Aprire il terminale:** menu Terminale → Nuovo terminale (oppure `Ctrl+ò`).
Tutti i comandi di questa guida vanno scritti in quel terminale.

Solo se la cartella `node_modules` non esiste (per esempio su un computer nuovo):

```
npm install
```

---

## 3. Il ciclo di lavoro

Ogni modifica segue sempre gli stessi quattro passi:

```
1. npm run dev          → avvia l'anteprima su http://localhost:4321/sito/
2. modifichi i file     → l'anteprima si aggiorna da sola
3. npm run build        → controllo finale (facoltativo ma consigliato)
4. git add -A
   git commit -m "Cosa ho cambiato"
   git push             → dopo 1–2 minuti il sito online è aggiornato
```

- L'anteprima resta attiva finché il terminale è aperto; per fermarla premi `Ctrl+C`.
- Mentre l'anteprima è attiva, per gli altri comandi apri un **secondo terminale** (icona `+`).
- In anteprima vedi anche i materiali in bozza (`draft: true`); online no.

---

## 4. Dove si trova ogni cosa

```
Sito Web/
├── src/
│   ├── data/
│   │   ├── site.ts            ← nome, istituto, email, materie, ricevimento, menu
│   │   └── competenze.ts      ← lingue, competenze digitali, metodologie (curriculum)
│   ├── pagine/
│   │   └── chi-sono.md        ← testo della pagina "Chi sono"
│   └── content/
│       ├── materiali/         ← una scheda .md per ogni materiale didattico
│       ├── curriculum/        ← un file .yaml per ogni voce del curriculum
│       └── progetti/          ← una scheda .md per ogni progetto (sezione nascosta)
├── public/
│   ├── documenti/             ← PDF e altri allegati, una cartella per materiale
│   └── slides/                ← presentazioni HTML, una cartella per presentazione
├── private/                   ← file personali: NON viene mai pubblicata
└── GUIDA.md                   ← questa guida
```

Le altre cartelle (`src/pages`, `src/components`, `src/layouts`, `src/lib`) contengono il
codice del sito: per aggiornare i contenuti non serve toccarle.

---

## 5. Dati generali del sito

File: **`src/data/site.ts`**

### Dati personali

```ts
export const SITE = {
  titolo: 'Prof. Antonio Natale',        // compare nella scheda del browser e in alto
  nome: 'Antonio Natale',
  ruolo: 'Docente di scuola secondaria di secondo grado',
  istituto: 'Nome dell\'istituto',       // l'apostrofo dentro '...' va scritto \'
  descrizione: 'Materiali didattici e curriculum. ...',
  email: 'nome.cognome@scuola.it',       // usa l'email istituzionale
  lingua: 'it'
} as const;
```

> **Attenzione agli apostrofi:** il testo è racchiuso tra apici `'...'`. Se contiene un
> apostrofo scrivilo `\'` (es. `'Istituto d\'Istruzione Superiore'`), oppure racchiudi
> il testo tra virgolette doppie: `"Istituto d'Istruzione Superiore"`.

### Materie

```ts
export const MATERIE = [
  { slug: 'informatica', nome: 'Informatica', descrizione: '...', colore: 'blu' },
  { slug: 'tpsc',        nome: 'TPSC',        descrizione: '...', colore: 'verde' }
]
```

- `slug`: identificativo usato nelle schede dei materiali (`materia: informatica`) e
  nell'indirizzo della pagina (`/didattica/materia/informatica/`).
  Solo minuscole, numeri e trattini. **Non cambiarlo** se ci sono già materiali che lo usano.
- `nome` e `descrizione`: si possono cambiare liberamente.
- `colore`: uno tra `blu`, `verde`, `ambra`, `rosa`, `viola`, `ciano`.
- Per aggiungere una materia copia un blocco `{ ... },` e modificalo.

### Ricevimento

```ts
export const RICEVIMENTO = {
  orari: [
    { giorno: 'Lunedì', ora: '10:00 – 11:00', note: 'In presenza' },
    { giorno: 'Giovedì', ora: '15:00 – 16:00', note: 'Online, su prenotazione' }
  ],
  prenotazione: 'Come si prenota ...',
  linkRegistro: 'https://...',           // link al registro elettronico
  note: 'Durante il periodo degli scrutini il ricevimento è sospeso.'
};
```

Per aggiungere o togliere un orario aggiungi o cancella una riga `{ giorno: ..., },`.

### Social

```ts
export const SOCIAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/...' }
];
```

Le righe che iniziano con `//` sono commenti e vengono ignorate: per attivarle togli `//`.

---

## 6. Pagina "Chi sono"

File: **`src/pagine/chi-sono.md`**

Scrivi il testo in Markdown (vedi [sezione 11](#11-scrivere-in-markdown)). I titoli con `##`
diventano i paragrafi della pagina. Nome, materie e contatti vengono aggiunti
automaticamente da `site.ts`.

---

## 7. Curriculum

Ogni voce del curriculum è un file `.yaml` in **`src/content/curriculum/`**.

### Aggiungere una voce (consigliato)

```
npm run new:cv
```

Lo script chiede sezione, titolo, ente, date ecc. e crea il file.

### Il formato di una voce

```yaml
sezione: insegnamento
titolo: Docente di Informatica e TPSC
ente: Nome dell'istituto
luogo: Città
dal: 2022-09-01
al: 2023-06-30                 # se manca, la voce risulta "in corso"
descrizione: Insegnamento nelle classi del triennio.
dettagli: [Classe di concorso A041, Contratto a tempo indeterminato]
url: https://...               # facoltativo, link esterno
allegato: documenti/attestato.pdf   # facoltativo, file in public/
draft: false                   # true = nascosta online
```

**Sezioni disponibili** (campo `sezione`):

| Valore | Titolo mostrato |
|---|---|
| `insegnamento` | Esperienze di insegnamento |
| `incarichi` | Incarichi scolastici |
| `titoli` | Titoli di studio |
| `formazione` | Formazione e aggiornamento |
| `certificazioni` | Certificazioni |
| `lavoro` | Altre esperienze lavorative |
| `pubblicazioni` | Pubblicazioni e convegni (campi extra: `autori: [..]`, `doi: ...`) |

- Le date si scrivono `AAAA-MM-GG`. Le voci sono ordinate dalla più recente.
- Il nome del file non compare sul sito: usa nomi descrittivi (`laurea-informatica.yaml`).
- Per togliere una voce cancella il file (o metti `draft: true`).

### Competenze

File: **`src/data/competenze.ts`** — tre elenchi: `LINGUE`, `COMPETENZE_DIGITALI`,
`METODOLOGIE`. Un elenco vuoto (`[]`) nasconde il blocco corrispondente.

---

## 8. Materiali didattici

Ogni materiale ha **due parti**:

1. una **scheda** `.md` in `src/content/materiali/` (titolo, materia, argomento, testo);
2. gli eventuali **file** (PDF, ecc.) in `public/documenti/<nome-materiale>/`.

### Creare un materiale (consigliato)

```
npm run new:materiale
```

Lo script chiede titolo, descrizione, materia, argomento, classi, tipo e se salvarlo come
bozza. Crea:
- la scheda `src/content/materiali/<nome>.md`
- la cartella vuota `public/documenti/<nome>/` per gli allegati.

### Il formato della scheda

```markdown
---
title: Le reti di computer
description: Dispensa introduttiva su modelli ISO/OSI e TCP/IP.
materia: informatica
argomento: Reti
classi: [4, 5]
data: 2026-11-09
tipo: dispensa
tags: [reti, tcp-ip]
allegati:
  - nome: Dispensa completa (PDF)
    file: documenti/le-reti-di-computer/dispensa.pdf
  - nome: Esercizi
    file: documenti/le-reti-di-computer/esercizi.pdf
slides: slides/reti/
draft: false
---

Qui il testo della pagina: obiettivi, indice, istruzioni...
```

| Campo | Obbligatorio | Note |
|---|---|---|
| `title` | sì | Titolo del materiale |
| `description` | sì | Una o due righe, compare nelle schede |
| `materia` | sì | Uno degli `slug` di `site.ts` (`informatica`, `tpsc`) |
| `argomento` | sì | Raggruppa i materiali: vedi sotto |
| `classi` | no | Anni consigliati da 1 a 5, es. `[3]` o `[3, 4]` |
| `data` | sì | `AAAA-MM-GG`. Determina l'ordine e gli "Ultimi materiali" in home |
| `tipo` | no | `dispensa` (predefinito), `slide`, `esercizi`, `mappa`, `recupero`, `compiti`, `simulazione`, `laboratorio`, `video`, `altro` |
| `tags` | no | Parole chiave, usate dalla ricerca |
| `allegati` | no | Elenco di file da scaricare (vedi [sezione 9](#9-allegati-immagini-e-slide)) |
| `slides` | no | Cartella di una presentazione HTML |
| `draft` | no | `true` = bozza, visibile solo in anteprima |

### Argomenti

- I materiali con lo **stesso identico** `argomento` vengono raggruppati insieme.
  `Basi di dati` e `Basi di Dati` sono due argomenti diversi: copia sempre il testo da una
  scheda esistente.
- Gli argomenti sono mostrati in **ordine alfabetico**. Se vuoi l'ordine del programma
  numerali: `1. Algoritmi`, `2. Variabili e tipi`, ... (il numero si vede anche sul sito).
  Oltre il 9 usa `01.`, `02.`, ... per mantenere l'ordine corretto.
- Dentro un argomento i materiali sono ordinati per `data`, dal più recente.

### Home page

La sezione "Ultimi materiali" mostra **automaticamente** i 4 materiali con la `data` più
recente (escluse le bozze). Non serve fare nulla.

### Modificare o eliminare un materiale

- **Modificare:** apri la scheda `.md` e cambia ciò che serve.
- **Nascondere:** metti `draft: true`.
- **Eliminare:** cancella la scheda `.md` e la cartella `public/documenti/<nome>/`.

> **Attenzione:** l'indirizzo della pagina deriva dal **nome del file** della scheda
> (`le-reti-di-computer.md` → `/sito/didattica/le-reti-di-computer/`). Se rinomini il file,
> i link già condivisi con gli studenti smettono di funzionare.

---

## 9. Allegati, immagini e slide

### Allegati (PDF, Word, ecc.)

1. Copia il file in `public/documenti/<nome-materiale>/`.
2. Aggiungilo alla scheda:
   ```yaml
   allegati:
     - nome: Testo del link mostrato agli studenti
       file: documenti/<nome-materiale>/file.pdf
   ```
   Il percorso parte da `public/` e **non** inizia con `/`.

**Regole per i nomi dei file:** minuscole, trattini al posto degli spazi, niente accenti o
apostrofi. Sì: `dispensa-reti.pdf` — No: `Dispensa reti (v2).pdf`.

**Dimensioni:** GitHub non accetta file oltre 100 MB e avvisa sopra i 50 MB.
Per i video usa YouTube o Drive e metti il link nel testo della scheda.

### Immagini nel testo

1. Copia l'immagine in `public/documenti/<nome-materiale>/`.
2. Nel testo della scheda scrivi il percorso **completo, con `/sito/` davanti**:
   ```markdown
   ![Schema del modello ISO/OSI](/sito/documenti/le-reti-di-computer/iso-osi.png)
   ```

> Nel testo Markdown i percorsi interni vanno sempre scritti con `/sito/` davanti
> (anche i link ad altre pagine: `[vedi esercizi](/sito/didattica/esercizi-reti/)`).
> Nei campi `allegati` e `slides` invece **no**: lì il prefisso viene aggiunto da solo.

### Slide HTML

1. Crea una cartella `public/slides/<nome>/` con dentro un file `index.html`
   (va bene anche una presentazione esportata da altri strumenti in HTML).
   Un modello pronto è in `public/slides/esempio/index.html`.
2. Nella scheda del materiale aggiungi: `slides: slides/<nome>/`.

Per presentazioni PowerPoint o Google Slides è più semplice esportarle in **PDF** e
caricarle come allegato.

---

## 10. Sezione Progetti

La sezione è **nascosta**. Per riattivarla, in `src/data/site.ts`:

```ts
export const MOSTRA_PROGETTI = true;
```

Tornano visibili la voce nel menu, il riquadro in home e le pagine dei progetti.
I progetti sono schede `.md` in `src/content/progetti/`, con questi campi:

```yaml
title: Titolo del progetto
description: Breve descrizione
data: 2026-10-01
tipo: PCTO              # PCTO, PTOF, Erasmus+, olimpiadi, uscita didattica, altro
annoScolastico: "2026/27"   # tra virgolette
materie: [informatica]
stato: in corso         # oppure: concluso
tags: []
link: https://...       # facoltativo
inEvidenza: true        # true = mostrato per primo in home
draft: false
```

---

## 11. Scrivere in Markdown

| Scrivi | Ottieni |
|---|---|
| `## Titolo` | Titolo di sezione (`###` per un sottotitolo) |
| `**grassetto**` | **grassetto** |
| `*corsivo*` | *corsivo* |
| `- voce` | Elenco puntato |
| `1. voce` | Elenco numerato |
| `[testo](https://...)` | Link |
| `![descrizione](/sito/percorso/immagine.png)` | Immagine |
| `` `codice` `` | `codice` in linea |
| `> testo` | Riquadro di citazione/nota |

**Blocchi di codice** (con evidenziazione della sintassi):

````markdown
```python
for i in range(10):
    print(i)
```
````

Linguaggi utili: `python`, `c`, `cpp`, `java`, `javascript`, `html`, `css`, `sql`, `bash`.

**Tabelle:**

```markdown
| Termine | Significato |
| ------- | ----------- |
| CPU     | Unità centrale di elaborazione |
```

Lascia una **riga vuota** tra paragrafi, titoli, elenchi e tabelle.

### Attenzione all'intestazione YAML (tra le righe `---`)

- I due punti `:` in un valore richiedono le virgolette:
  `title: "Python: le liste"`
- Rispetta i rientri (2 spazi) sotto `allegati:`.
- Le date senza virgolette: `data: 2026-11-09`.

---

## 12. Pubblicare le modifiche

```
git add -A
git commit -m "Aggiunta dispensa sulle reti"
git push
```

- `git add -A` prepara tutte le modifiche, `commit` le salva con una descrizione,
  `push` le invia a GitHub.
- Dopo 1–2 minuti il sito è aggiornato. Se nel browser vedi ancora la vecchia versione,
  ricarica con `Ctrl+F5`.
- Puoi seguire la pubblicazione nella scheda **Actions** del repository:
  pallino giallo = in corso, ✓ verde = pubblicato, ✗ rossa = errore (vedi sezione 14).

**Comandi utili:**

| Comando | A cosa serve |
|---|---|
| `git status` | Mostra quali file hai modificato |
| `git diff` | Mostra le modifiche riga per riga |
| `git log --oneline` | Elenco delle versioni salvate |
| `git restore nome-file` | Annulla le modifiche non salvate a un file |
| `git restore .` | Annulla **tutte** le modifiche non salvate (attenzione!) |
| `git pull` | Scarica le modifiche fatte altrove (browser, altro PC) |

---

## 13. Lavorare da un altro computer o dal browser

### Dal browser (senza installare nulla)

Su https://github.com/Antonio-Natale/sito:
- **Modificare un file:** aprilo → icona matita ✏️ → modifica → **Commit changes**.
- **Caricare un PDF:** entra nella cartella (es. `public/documenti/...`) →
  **Add file → Upload files** → **Commit changes**.

Il sito si aggiorna come con il push.
**Importante:** prima di lavorare di nuovo sul PC, esegui `git pull` per scaricare queste
modifiche, altrimenti il push successivo verrà rifiutato.

### Da un altro computer

```
git clone https://github.com/Antonio-Natale/sito.git
cd sito
npm install
git config user.name "Antonio Natale"
git config user.email "205491587+Antonio-Natale@users.noreply.github.com"
```

L'ultima riga usa l'email anonima di GitHub, così la tua email personale non compare
nel repository pubblico.

---

## 14. Errori comuni e soluzioni

**La pubblicazione su GitHub ha la ✗ rossa.**
Apri la scheda **Actions**, clicca sull'esecuzione fallita e poi su **build**: il messaggio
indica file e riga. Il sito online resta quello precedente. Correggi, poi commit e push.
Per scoprirlo prima, esegui `npm run build` in locale.

**`materia: Expected 'informatica' | 'tpsc'`**
Nel campo `materia` c'è un valore che non è uno `slug` di `site.ts`. Controlla maiuscole e
spazi.

**`... Required` / `invalid date`**
Manca un campo obbligatorio (`title`, `description`, `argomento`, `data`) o la data non è
nel formato `AAAA-MM-GG`.

**Errore YAML (`bad indentation`, `incomplete explicit mapping`)**
Di solito: due punti `:` in un valore senza virgolette, oppure rientri sbagliati sotto
`allegati:`.

**Il link a un allegato porta a una pagina 404.**
Controlla che il percorso in `file:` corrisponda esattamente al file in `public/`
(maiuscole comprese: online `Dispensa.pdf` e `dispensa.pdf` sono diversi).

**Un'immagine nel testo non si vede online.**
Manca `/sito/` all'inizio del percorso (vedi [sezione 9](#9-allegati-immagini-e-slide)).

**Il materiale non compare online.**
Ha `draft: true`, oppure non hai fatto commit e push.

**`git push` rifiutato (`rejected`, `fetch first`).**
Su GitHub ci sono modifiche che non hai sul PC (fatte dal browser). Esegui `git pull`,
poi di nuovo `git push`.

**`npm run dev` dice che la porta è occupata.**
L'anteprima è già attiva in un altro terminale: usa quella, oppure chiudila con `Ctrl+C`.

**`npm: command not found` o `astro: not found`.**
Node.js non è installato, oppure manca `npm install` nella cartella del progetto.

---

## 15. Privacy: cosa non pubblicare

Il sito e il repository sono **pubblici** e li leggono studenti minorenni e famiglie.

- **Mai** nomi, foto, voti o dati degli studenti.
- Nel curriculum niente indirizzo di casa, telefono personale, data di nascita, codice fiscale.
  Basta l'email istituzionale.
- Foto di attività solo senza volti riconoscibili o con le liberatorie della scuola.
- Materiali di terzi (libri di testo, immagini) solo se la licenza lo consente.
- Verifiche con soluzioni, griglie, bozze: tienile nella cartella **`private/`**, che non
  viene mai inviata a GitHub.

> Attenzione: anche un file cancellato resta nella **cronologia** di git. Se pubblichi per
> errore qualcosa di sensibile, non basta cancellarlo: chiedi aiuto per rimuoverlo dalla
> cronologia.

---

## 16. Promemoria rapido

```
npm run dev              anteprima su http://localhost:4321/sito/
npm run new:materiale    nuovo materiale didattico
npm run new:cv           nuova voce del curriculum
npm run build            controllo finale prima di pubblicare

git add -A
git commit -m "..."      salva le modifiche
git push                 pubblica (1–2 minuti)
git pull                 scarica modifiche fatte altrove
```

| Voglio cambiare... | File |
|---|---|
| Nome, istituto, email, materie, ricevimento, social | `src/data/site.ts` |
| Testo "Chi sono" | `src/pagine/chi-sono.md` |
| Voci del curriculum | `src/content/curriculum/*.yaml` |
| Lingue e competenze | `src/data/competenze.ts` |
| Materiali | `src/content/materiali/*.md` + `public/documenti/` |
| Mostrare/nascondere Progetti | `MOSTRA_PROGETTI` in `src/data/site.ts` |
