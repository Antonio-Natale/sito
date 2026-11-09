// Indice JSON statico dei materiali (generato in fase di build).
// Utile per una futura ricerca lato client o per integrazioni esterne.
import { getMateria } from '@/data/site';
import { byDateDesc, getPublished, withBase } from '@/lib/utils';

export async function GET() {
  const materiali = (await getPublished('materiali')).sort(byDateDesc);

  const dati = materiali.map((m) => ({
    titolo: m.data.title,
    descrizione: m.data.description,
    materia: getMateria(m.data.materia)?.nome ?? m.data.materia,
    argomento: m.data.argomento,
    tipo: m.data.tipo,
    classi: m.data.classi,
    data: m.data.data.toISOString(),
    tags: m.data.tags,
    url: withBase(`/didattica/${m.slug}/`)
  }));

  return new Response(JSON.stringify(dati, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
