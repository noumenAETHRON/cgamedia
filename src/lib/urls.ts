import { site } from '../config/site.ts';

export function absolute(pathname: string): string {
  return new URL(pathname, site.url).href;
}

export function youtubeEmbed(id: string | undefined): string | null {
  if (!id || id.includes('TODO')) return null;
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
}

export function spotifyEmbed(id: string | undefined): string | null {
  if (!id || id.includes('TODO')) return null;
  return `https://open.spotify.com/embed/episode/${encodeURIComponent(id)}?utm_source=generator`;
}

export function youtubeWatch(id: string | undefined): string | null {
  if (!id || id.includes('TODO')) return null;
  return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
}

export function spotifyEpisode(id: string | undefined): string | null {
  if (!id || id.includes('TODO')) return null;
  return `https://open.spotify.com/episode/${encodeURIComponent(id)}`;
}
