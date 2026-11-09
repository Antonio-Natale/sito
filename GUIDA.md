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
4. [Gli script disponibili](#4-gli-script-disponibili)
5. [Dove si trova ogni cosa](#5-dove-si-trova-ogni-cosa)
6. [Dati generali del sito](#6-dati-generali-del-sito)
7. [Pagina "Chi sono"](#7-pagina-chi-sono)
8. [Curriculum](#8-curriculum)
9. [Materiali didattici](#9-materiali-didattici)
10. [Allegati, immagini e slide](#10-allegati-immagini-e-slide)
11. [Sezione Progetti](#11-sezione-progetti)
12. [Scrivere in Markdown](#12-scrivere-in-markdown)
13. [Pubblicare le modifiche](#13-pubblicare-le-modifiche)
14. [Lavorare da un altro computer o dal browser](#14-lavorare-da-un-altro-computer-o-dal-browser)
15. [Errori comuni e soluzioni](#15-errori-comuni-e-soluzioni)
16. [Privacy: cosa non pubblicare](#16-privacy-cosa-non-pubblicare)
17. [Promemoria rapido](#17-promemoria-rapido)

---

## 1. Come funziona, in breve

- Il sito è fatto con **Astro**: i contenuti sono semplici file di testo (`.md`, `.yaml`, `.ts`)
  che Astro trasforma in pagine web.
- Il codice è su **GitHub**. Ogni volta che invii una modifica (*push*), GitHub ricostruisce
  e ripubblica il sito da solo in pochi minuti.
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

Ogni modifica segue sempre gli stessi passi:

```
1. npm run new:materiale  → (se aggiungi un materiale) crea la scheda già compilata
2. npm run dev            → avvia l'anteprima su http://localhost:4321/sito/
3. modifichi i file       → l'anteprima si aggiorna da sola
4. npm run build          → controllo finale (facoltativo ma consigliato)
5. git add -A
   git commit -m "Cosa ho cambiato"
   git push               → dopo qualche minuto il sito online è aggiornato
```

- L'anteprima resta attiva finché il terminale è aperto; per fermarla premi `Ctrl+C`.
- Mentre l'anteprima è attiva, per gli altri comandi apri un **secondo terminale** (icona `+`).
- In anteprima vedi anche i materiali in bozza (`draft: true`); online no.

---

## 4. Gli script disponibili

Gli script sono comandi già pronti del progetto. Si lanciano dal terminale, nella cartella
del sito, scrivendo `npm run` seguito dal nome.

### Riepilogo

| Comando | A cosa serve | Quando usarlo |
|---|---|---|
| `npm run new:materiale` | Crea un nuovo materiale didattico | Ogni volta che aggiungi un materiale |
| `npm run new:cv` | Crea una nuova voce del curriculum | Ogni volta che aggiungi una voce al CV |
| `npm run dev` | Anteprima del sito sul tuo computer | Mentre scrivi e modifichi |
| `npm run start` | Uguale a `npm run dev` | — |
| `npm run build` | Controlla tutto il sito e lo prepara per la pubblicazione | Prima di pubblicare |
| `npm run preview` | Mostra la versione preparata da `build`, identica a quella online | Dopo `build`, per un controllo finale |
| `npm run astro` | Accesso diretto agli strumenti di Astro | Di solito mai |

**Pubblicare non è uno script:** il sito va online da solo dopo `git push`
(vedi [sezione 13](#13-pubblicare-le-modifiche)).

### `npm run new:materiale` — nuovo materiale didattico

Fa alcune domande e crea la scheda del materiale già nel formato giusto.

```
npm run new:materiale
npm run new:materiale -- "Le reti di computer"     ← con il titolo già indicato
```

Le domande, in ordine:

| Domanda | Cosa rispondere |
|---|---|
| Titolo | Il titolo del materiale (se non l'hai scritto nel comando) |
| Descrizione breve | Una riga; invio = uguale al titolo |
| Materia | Il numero della materia nell'elenco |
| Argomento | Il numero di un argomento già previsto in `site.ts`, oppure «Nuovo argomento…» e poi il nome |
| Posizione dentro l'argomento | 1, 2, 3…; invio = ordine per data |
| Classi | Anni da 1 a 5 separati da virgola, es. `3, 4`; invio = adatto a tutte le classi |
| Tipo | Il numero del tipo (dispensa, slide, esercizi…); invio = dispensa |
| Salvare come bozza? | `s` = bozza, visibile solo in anteprima; `n` = pubblicato al prossimo push |

Alla fine crea:
- la scheda `src/content/materiali/<nome>.md` (il nome deriva dal titolo);
- la cartella vuota `public/documenti/<nome>/` per i PDF e le immagini.

**Apri la scheda creata:** contiene un commento accanto a ogni campo, gli esempi già pronti
per allegati e slide (basta togliere i `#`) e alcuni esempi di formattazione nel testo da
cancellare o modificare. Se scegli un argomento nuovo, lo script ti ricorda di aggiungerlo
all'elenco `argomenti` in `site.ts` (vedi [sezione 6](#6-dati-generali-del-sito)).

> Lo script crea la scheda direttamente in `src/content/materiali/`. Se preferisci
> organizzare i materiali in sottocartelle (es. `competenze-digitali/`), spostala tu:
> l'indirizzo della pagina conterrà anche il nome della cartella.

### `npm run new:cv` — nuova voce del curriculum

```
npm run new:cv
```

| Domanda | Cosa rispondere |
|---|---|
| Sezione | Il numero della sezione (insegnamento, titoli, certificazioni…) |
| Titolo | Es. «Docente di Informatica», «Laurea magistrale in…» |
| Ente | Scuola, università, ente certificatore… |
| Luogo | Facoltativo; invio per saltare |
| Dal | `AAAA-MM` (vanno bene anche `AAAA` o `AAAA-MM-GG`) |
| Al | `AAAA-MM`; **`=`** se è una data sola (titoli, certificazioni); invio se è ancora in corso |
| Descrizione breve | Facoltativa |
| Dettagli | Informazioni brevi separate da `;`, es. `Classe di concorso A041; 25 ore` |
| Autori, DOI | Solo per la sezione *pubblicazioni* |
| Salvare come bozza? | Invio = no |

Crea il file `src/content/curriculum/<sezione>-<titolo>.yaml`. Anche qui i campi facoltativi
non compilati (luogo, link, allegato…) restano nel file come esempi commentati: togli il `#`
per usarli.

### `npm run dev` — anteprima mentre lavori

```
npm run dev
```

- Apri **http://localhost:4321/sito/** nel browser.
- Ogni volta che salvi un file la pagina si aggiorna da sola.
- Mostra **anche le bozze** (`draft: true`).
- Per fermarla: `Ctrl+C` nel terminale.

### `npm run build` — controllo prima di pubblicare

```
npm run build
```

Controlla tutti i file (campi mancanti, date sbagliate, errori di scrittura nelle
intestazioni) e prepara il sito nella cartella `dist/`.

- Se finisce con `Complete!` e `0 errors` puoi pubblicare tranquillo.
- Se c'è un errore, il messaggio indica **file e riga** (vedi [sezione 15](#15-errori-comuni-e-soluzioni)).

È lo stesso controllo che fa GitHub prima di pubblicare: farlo prima evita sorprese.

### `npm run preview` — il sito esattamente come andrà online

```
npm run build
npm run preview
```

Mostra la versione preparata da `build` su **http://localhost:4321/sito/**: è identica a
quella che verrà pubblicata, **senza bozze**. Utile per un ultimo controllo. Si ferma con
`Ctrl+C`.

### `npm run astro` — uso avanzato

Dà accesso ai comandi di Astro (es. `npm run astro -- check`). Per aggiornare i contenuti
non serve.

---

## 5. Dove si trova ogni cosa

```
Sito Web/
├── src/
│   ├── data/
│   │   ├── site.ts            ← nome, istituto, email, materie e argomenti, ricevimento, menu
│   │   └── competenze.ts      ← lingue, competenze digitali, metodologie (curriculum)
│   ├── pagine/
│   │   └── chi-sono.md        ← testo della pagina "Chi sono"
│   └── content/
│       ├── materiali/         ← una scheda .md per ogni materiale didattico
│       ├── curriculum/        ← un file .yaml per ogni voce del curriculum
│       └── progetti/          ← una scheda .md per ogni progetto (sezione nascosta)
├── public/
│   ├── documenti/             ← PDF, immagini e altri allegati, una cartella per materiale
│   └── slides/                ← presentazioni HTML, una cartella per presentazione
├── scripts/                   ← gli script new:materiale e new:cv
├── private/                   ← file personali: NON viene mai pubblicata
└── GUIDA.md                   ← questa guida
```

Le altre cartelle (`src/pages`, `src/components`, `src/layouts`, `src/lib`) contengono il
codice del sito: per aggiornare i contenuti non serve toccarle.

---

## 6. Dati generali del sito

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

### Materie e ordine degli argomenti

```ts
export const MATERIE = [
  {
    slug: 'informatica',
    nome: 'Informatica',
    descrizione: '...',
    colore: 'blu',
    argomenti: ['Sicurezza informatica', 'Reti', 'Basi di dati']
  },
  ...
]
```

- `slug`: identificativo usato nelle schede dei materiali (`materia: informatica`) e
  nell'indirizzo della pagina (`/didattica/materia/informatica/`).
  Solo minuscole, numeri e trattini. **Non cambiarlo** se ci sono già materiali che lo usano.
- `nome` e `descrizione`: si possono cambiare liberamente.
- `colore`: uno tra `blu`, `verde`, `ambra`, `rosa`, `viola`, `ciano`.
- `argomenti`: **l'ordine in cui gli argomenti compaiono sul sito** (pagina della materia e
  filtro «Argomento»). I nomi vanno scritti **esattamente** come nel campo `argomento` dei
  materiali. Un argomento non elencato compare lo stesso, in fondo, in ordine alfabetico.
  `npm run new:materiale` propone questo elenco quando scegli l'argomento.
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

## 7. Pagina "Chi sono"

File: **`src/pagine/chi-sono.md`**

Scrivi il testo in Markdown (vedi [sezione 12](#12-scrivere-in-markdown)). I titoli con `##`
diventano i paragrafi della pagina. Nome, materie e contatti vengono aggiunti
automaticamente da `site.ts`.

---

## 8. Curriculum

Ogni voce del curriculum è un file `.yaml` in **`src/content/curriculum/`**.

### Aggiungere una voce (consigliato)

```
npm run new:cv
```

Vedi [sezione 4](#npm-run-newcv--nuova-voce-del-curriculum) per le domande dello script.

### Il formato di una voce

```yaml
sezione: insegnamento
titolo: Docente di Informatica e TPSC
ente: Nome dell'istituto
luogo: Città
dal: 2022-09-01
al: 2023-06-30                 # se manca, la voce risulta "in corso"
descrizione: Insegnamento nelle classi del triennio.
dettagli:
  - Classe di concorso A041
  - Contratto a tempo indeterminato
url: https://...               # facoltativo, link esterno sul titolo
allegato: documenti/curriculum/attestato.pdf   # facoltativo, file in public/
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
| `pubblicazioni` | Pubblicazioni e convegni (campi extra: `autori`, `doi`) |

- Le date si scrivono `AAAA-MM-GG` e sul sito compaiono come mese e anno.
  Con `al` uguale a `dal` compare una data sola (utile per titoli e certificazioni).
- Le voci sono ordinate dalla più recente.
- **Allegato PDF** (es. un attestato): sotto la voce compare «Visualizza documento», che apre
  il PDF nel visualizzatore del sito, senza pulsante di download. Il PDF viene caricato solo
  quando si apre il pannello. Un allegato non PDF (es. un'immagine) compare come semplice link.
- Il nome del file non compare sul sito: usa nomi descrittivi (`laurea-informatica.yaml`).
- Per togliere una voce cancella il file (o metti `draft: true`).

### Competenze

File: **`src/data/competenze.ts`** — tre elenchi: `LINGUE`, `COMPETENZE_DIGITALI`,
`METODOLOGIE`. Un elenco vuoto (`[]`) nasconde il blocco corrispondente.

---

## 9. Materiali didattici

Ogni materiale ha **due parti**:

1. una **scheda** `.md` in `src/content/materiali/` (titolo, materia, argomento, testo);
2. gli eventuali **file** (PDF, immagini…) in `public/documenti/<nome-materiale>/`.

### Creare un materiale (consigliato)

```
npm run new:materiale
```

Vedi [sezione 4](#npm-run-newmateriale--nuovo-materiale-didattico) per le domande dello
script. La scheda creata contiene già le istruzioni nei commenti.

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
ordine: 1
tags: [reti, tcp-ip]
allegati:
  - nome: Dispensa completa
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
| `classi` | no | Anni consigliati da 1 a 5, es. `[3]` o `[3, 4]`; `[]` = tutte le classi. Usato dal filtro «Classe» |
| `data` | sì | `AAAA-MM-GG`. Determina gli "Ultimi materiali" in home e l'ordine dentro l'argomento |
| `tipo` | no | `dispensa` (predefinito), `slide`, `esercizi`, `mappa`, `recupero`, `compiti`, `simulazione`, `laboratorio`, `video`, `altro` |
| `ordine` | no | Posizione dentro l'argomento: 1, 2, 3… (vedi sotto) |
| `tags` | no | Parole chiave, usate dalla ricerca |
| `allegati` | no | PDF da leggere nella pagina (vedi [sezione 10](#10-allegati-immagini-e-slide)) |
| `slides` | no | Cartella di una presentazione HTML |
| `draft` | no | `true` = bozza, visibile solo in anteprima |

### Argomenti e ordine

- I materiali con lo **stesso identico** `argomento` vengono raggruppati insieme.
  `Basi di dati` e `Basi di Dati` sono due argomenti diversi: copia sempre il testo da una
  scheda esistente, oppure scegli l'argomento dall'elenco proposto da `npm run new:materiale`.
- **L'ordine degli argomenti** lo decidi nell'elenco `argomenti` della materia in `site.ts`
  (vedi [sezione 6](#6-dati-generali-del-sito)). Gli argomenti non elencati vanno in fondo,
  in ordine alfabetico.
- **Dentro un argomento** i materiali con `ordine` vengono per primi (1, 2, 3…); quelli senza
  `ordine` seguono, dal più recente.

### Filtri nella pagina Didattica

Gli studenti possono filtrare per testo, materia, argomento, tipo e **classe**.
I filtri funzionano anche come link da condividere, per esempio:
`https://antonio-natale.github.io/sito/didattica/?classe=4` apre la pagina già filtrata
sui materiali per la 4ª. Si possono combinare: `?materia=informatica&classe=3`.

### Home page

La sezione "Ultimi materiali" mostra **automaticamente** i 4 materiali con la `data` più
recente (escluse le bozze). Non serve fare nulla.

### Modificare o eliminare un materiale

- **Modificare:** apri la scheda `.md` e cambia ciò che serve.
- **Nascondere:** metti `draft: true`.
- **Eliminare:** cancella la scheda `.md` e la cartella `public/documenti/<nome>/`.

> **Attenzione:** l'indirizzo della pagina deriva dal **nome del file** della scheda
> (`le-reti-di-computer.md` → `/sito/didattica/le-reti-di-computer/`). Se rinomini o sposti
> il file, i link già condivisi con gli studenti smettono di funzionare.

---

## 10. Allegati, immagini e slide

### Allegati PDF: si leggono nel sito, non si scaricano

1. Copia il file in `public/documenti/<nome-materiale>/`.
2. Aggiungilo alla scheda:
   ```yaml
   allegati:
     - nome: Titolo mostrato sopra il documento
       file: documenti/<nome-materiale>/file.pdf
   ```
   Il percorso parte da `public/` e **non** inizia con `/`.

Ogni PDF compare **dentro la pagina**, in un visualizzatore con zoom (+/−), indicatore di
pagina e pulsante **schermo intero** (⛶). Non c'è il pulsante di download; tasto destro,
Ctrl+S e Ctrl+P sono bloccati e il documento non viene stampato.

> È un **deterrente**, non una protezione assoluta: il sito e il repository sono pubblici,
> quindi chi sa usare gli strumenti per sviluppatori può comunque recuperare il file.

**Per permettere il download** di un file particolare aggiungi `scaricabile: true`:

```yaml
allegati:
  - nome: Modulo da compilare
    file: documenti/<nome-materiale>/modulo.pdf
    scaricabile: true
```

**Allegati non PDF** (Word, testo, ecc.) non si possono mostrare nella pagina: compaiono come
link nel riquadro «Risorse» e si aprono in una nuova scheda. Se vuoi che restino solo
consultabili, convertili prima in PDF.

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

> **Mai percorsi con `../`** per le immagini (es. `../../documenti/...`): il sito cerca
> l'immagine nel posto sbagliato e **la pubblicazione si blocca**.
> Nel testo Markdown i percorsi interni vanno sempre scritti con `/sito/` davanti
> (anche i link ad altre pagine: `[vedi esercizi](/sito/didattica/esercizi-reti/)`).
> Nei campi `allegati` e `slides` invece **no**: lì il prefisso viene aggiunto da solo.

### Slide HTML

1. Crea una cartella `public/slides/<nome>/` con dentro un file `index.html`
   (va bene anche una presentazione esportata da altri strumenti in HTML).
   Un modello pronto è in `public/slides/esempio/index.html`.
2. Nella scheda del materiale aggiungi: `slides: slides/<nome>/`.

Le slide compaiono **dentro la pagina** del materiale (lo schermo intero è disponibile solo
se la presentazione HTML ha un suo pulsante).

Per presentazioni PowerPoint o Google Slides è più semplice esportarle in **PDF** e
caricarle come allegato: verranno mostrate nel visualizzatore.

---

## 11. Sezione Progetti

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

## 12. Scrivere in Markdown

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

> Tutto ciò che sta dentro un blocco di codice viene mostrato **così com'è**: link e immagini
> lì dentro non funzionano. Usa i blocchi solo per mostrare codice.

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
- Rispetta i rientri (2 spazi, non tabulazioni) sotto `allegati:` e `dettagli:`.
- Un elenco si scrive **o** vuoto (`allegati: []`) **o** con le voci sotto (`allegati:` e
  poi le righe `- nome: ...`), mai entrambe le cose.
- Le date senza virgolette: `data: 2026-11-09`.
- Le righe che iniziano con `#` sono commenti e vengono ignorate.

---

## 13. Pubblicare le modifiche

```
git add -A
git commit -m "Aggiunta dispensa sulle reti"
git push
```

- `git add -A` prepara tutte le modifiche, `commit` le salva con una descrizione,
  `push` le invia a GitHub.
- Dopo qualche minuto (di solito 2–4) il sito è aggiornato. Se nel browser vedi ancora la
  vecchia versione, ricarica con `Ctrl+F5`.
- Puoi seguire la pubblicazione nella scheda **Actions** del repository:
  pallino giallo = in corso, ✓ verde = pubblicato, ✗ rossa = errore (vedi [sezione 15](#15-errori-comuni-e-soluzioni)).

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

## 14. Lavorare da un altro computer o dal browser

### Dal browser (senza installare nulla)

Su https://github.com/Antonio-Natale/sito:
- **Modificare un file:** aprilo → icona matita ✏️ → modifica → **Commit changes**.
- **Caricare un PDF:** entra nella cartella (es. `public/documenti/...`) →
  **Add file → Upload files** → **Commit changes**.

Il sito si aggiorna come con il push. Dal browser non si possono usare gli script
(`npm run ...`): le schede vanno scritte a mano, copiando una esistente.
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

## 15. Errori comuni e soluzioni

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

**Errore YAML (`bad indentation`, `incomplete explicit mapping`, `end of the stream`)**
Di solito: due punti `:` in un valore senza virgolette, rientri sbagliati sotto `allegati:`,
oppure `allegati: []` lasciato con le voci scritte sotto (togli `[]`).

**`Could not resolve "../../documenti/..."`**
Un'immagine nel testo usa un percorso con `../`. Scrivilo con `/sito/` davanti
(vedi [sezione 10](#10-allegati-immagini-e-slide)).

**Un allegato o un'immagine non si vede online (errore o pagina 404).**
Controlla che il percorso corrisponda esattamente al file in `public/`
(maiuscole comprese: online `Dispensa.pdf` e `dispensa.pdf` sono diversi).

**Il PDF resta su «Caricamento del documento…».**
Se succede in anteprima, ferma `npm run dev` con `Ctrl+C`, riavvialo e ricarica la pagina
con `Ctrl+F5`. Se compare un messaggio rosso, il testo tra parentesi indica la causa
(es. file non trovato: controlla il percorso in `file:`).

**Il materiale non compare online.**
Ha `draft: true`, oppure non hai fatto commit e push.

**Un argomento compare in fondo alla lista invece che al suo posto.**
Il nome nel campo `argomento` non è scritto esattamente come nell'elenco `argomenti` di
`site.ts` (maiuscole, spazi, accenti).

**`git push` rifiutato (`rejected`, `fetch first`).**
Su GitHub ci sono modifiche che non hai sul PC (fatte dal browser). Esegui `git pull`,
poi di nuovo `git push`.

**`npm run dev` dice che la porta è occupata.**
L'anteprima è già attiva in un altro terminale: usa quella, oppure chiudila con `Ctrl+C`.

**`npm: command not found` o `astro: not found`.**
Node.js non è installato, oppure manca `npm install` nella cartella del progetto.

**Uno script si ferma con `✘ Esiste già: ...`.**
C'è già un materiale con lo stesso titolo: scegli un titolo diverso o modifica quello esistente.

---

## 16. Privacy: cosa non pubblicare

Il sito e il repository sono **pubblici** e li leggono studenti minorenni e famiglie.

- **Mai** nomi, foto, voti o dati degli studenti.
- Nel curriculum niente indirizzo di casa, telefono personale, data di nascita, codice fiscale.
  Basta l'email istituzionale.
- Foto di attività solo senza volti riconoscibili o con le liberatorie della scuola.
- Materiali di terzi (libri di testo, immagini) solo se la licenza lo consente.
- Verifiche con soluzioni, griglie, bozze: tienile nella cartella **`private/`**, che non
  viene mai inviata a GitHub.
- I PDF mostrati nel visualizzatore non hanno il pulsante di download, ma restano file
  pubblici: non caricare nulla che non potrebbe essere letto da chiunque.

> Attenzione: anche un file cancellato resta nella **cronologia** di git. Se pubblichi per
> errore qualcosa di sensibile, non basta cancellarlo: chiedi aiuto per rimuoverlo dalla
> cronologia.

---

## 17. Promemoria rapido

```
npm run new:materiale    nuovo materiale didattico (scheda + cartella allegati)
npm run new:cv           nuova voce del curriculum
npm run dev              anteprima su http://localhost:4321/sito/ (con le bozze)
npm run build            controllo finale prima di pubblicare
npm run preview          anteprima identica al sito online (dopo build)

git add -A
git commit -m "..."      salva le modifiche
git push                 pubblica (qualche minuto)
git pull                 scarica modifiche fatte altrove
```

| Voglio cambiare... | File |
|---|---|
| Nome, istituto, email, materie, ricevimento, social | `src/data/site.ts` |
| Ordine degli argomenti di una materia | `argomenti` in `src/data/site.ts` |
| Testo "Chi sono" | `src/pagine/chi-sono.md` |
| Voci del curriculum | `src/content/curriculum/*.yaml` |
| Lingue e competenze | `src/data/competenze.ts` |
| Materiali | `src/content/materiali/*.md` + `public/documenti/` |
| Mostrare/nascondere Progetti | `MOSTRA_PROGETTI` in `src/data/site.ts` |
