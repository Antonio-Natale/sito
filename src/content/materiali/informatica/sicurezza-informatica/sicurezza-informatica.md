---
# ── Intestazione del materiale ─────────────────────────────────────────
# Le righe che iniziano con # sono commenti: il sito le ignora.
# Rispetta i rientri (spazi, non tabulazioni) e i due punti dopo ogni campo.
title: "Sicurezza informatica"
description: "Presentazione per il biennio dell’Istituto Professionale per i Servizi per la Sanità e l’Assistenza Sociale. Spiega che cos’è la sicurezza informatica e quando un sistema è sicuro (riservatezza, integrità, disponibilità), con esempi tratti dal contesto socio-sanitario."
materia: informatica
# argomento: scritto esattamente come in "argomenti" di src/data/site.ts
argomento: "Sicurezza informatica"
# classi: anni da 1 a 5, es. [3, 4]; [] = adatto a tutte le classi
classi: [2]
data: 2026-11-11
# tipo: dispensa, slide, esercizi, mappa, recupero, compiti, simulazione, laboratorio, video, altro
tipo: slide
# ordine: posizione dentro l'argomento (1, 2, 3…); senza, si ordina per data
# ordine: 1
# tags: parole chiave per la ricerca, es. [ripasso, DSA]
tags: []

# ALLEGATI — per aggiungere PDF, togli il # SOLO dalle righe con "allegati",
# "- nome" e "file". I file vanno in public/documenti/sicurezza-informatica/
# I PDF si leggono nella pagina e non si scaricano; per permettere il download
# di un file aggiungi sotto il suo "file" la riga "    scaricabile: true".
allegati:
  - nome: Presentazione
    file: documenti/sicurezza-informatica/Sicurezza_Informatica_Didattica.pdf
#   - nome: Scheda di esercizi
#     file: documenti/sicurezza-informatica/altro-file.pdf

# SLIDE HTML (cartella in public/slides/sicurezza-informatica/ con dentro index.html):
# slides: slides/sicurezza-informatica/

# draft: true = bozza, visibile solo con "npm run dev"; false = pubblicato
draft: false
---