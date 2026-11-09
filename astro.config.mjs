import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// Sito pubblicato su GitHub Pages: username.github.io/nome-repo
// Se in futuro si passa a un dominio personale, aggiornare "site" e rimuovere "base".
const SITE_URL = 'https://antonio-natale.github.io';
const BASE_PATH = '/sito';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'always',
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    shikiConfig: { theme: 'github-dark' }
  }
});
