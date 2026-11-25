import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config/site.ts';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export const GET: APIRoute = async () => {
  const episodes = (await getCollection('episodes'))
    .filter((episode) => episode.data.draft !== true)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const items = episodes
    .map((episode) => {
      const link = `${site.url}/episodios/${episode.id}/`;
      return `<item>
        <title>${escapeXml(episode.data.title)}</title>
        <link>${link}</link>
        <guid>${link}</guid>
        <pubDate>${episode.data.pubDate.toUTCString()}</pubDate>
        <description>${escapeXml(episode.data.description)}</description>
      </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.seriesName)} · ${escapeXml(site.name)}</title>
    <link>${site.url}/episodios/</link>
    <description>${escapeXml(site.description)}</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
