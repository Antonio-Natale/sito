import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, getMateria } from '@/data/site';
import { byDateDesc, getPublished, withBase } from '@/lib/utils';

export async function GET(context: APIContext) {
  const materiali = (await getPublished('materiali')).sort(byDateDesc);

  return rss({
    title: SITE.titolo,
    description: SITE.descrizione,
    site: new URL(import.meta.env.BASE_URL, context.site!).href,
    items: materiali.map((m) => ({
      title: m.data.title,
      description: m.data.description,
      pubDate: m.data.data,
      link: withBase(`/didattica/${m.slug}/`),
      categories: [getMateria(m.data.materia)?.nome ?? m.data.materia, m.data.argomento, ...m.data.tags]
    })),
    customData: '<language>it-it</language>'
  });
}
