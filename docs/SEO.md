# SEO

Dominio canónico: `https://cgamedia.cc`. Sin www. El idioma por defecto es el español (`es-ES`).

## Qué lleva cada página

`src/layouts/BaseLayout.astro` escribe, en todas:

- `<title>` único. La portada es «CGA Media · Hablemos de dinero». El resto es «Nombre · CGA Media». El título no cambia con el modo de lectura.
- `meta name="description"` propio de esa página.
- `link rel="canonical"` absoluto, con barra final (`trailingSlash: 'always'`), salvo `rss.xml`.
- `hreflang="es"` y `hreflang="x-default"` apuntando al mismo canónico. El `en` se añade cuando exista la traducción; el comentario está en la plantilla y el hueco en `src/i18n/en.ts`.
- Open Graph (`og:title`, `og:description`, `og:url`, `og:image`, `og:locale=es_ES`, `og:type`) y Twitter Card `summary_large_image`.
- La imagen es `public/og.png` (1200×630).
- `theme-color`, favicon SVG, autor, RSS (`/rss.xml`).

La 404 lleva `noindex`. El resto se indexa.

## Datos estructurados

JSON-LD, con `@context` de schema.org:

| Dónde | Tipos |
| --- | --- |
| Portada | `Organization`, `WebSite` |
| Sobre | `Person` (Carlos Gómez Artiles) y `Organization` |
| `/episodios/` | `PodcastSeries` («Hablemos de dinero») |
| Cada episodio | `PodcastEpisode`. Si el id de YouTube ya no es TODO, también `VideoObject` |
| Artículo del Laboratorio | `Article` |
| Interiores | `BreadcrumbList` |

No hay `SearchAction`: no hay buscador. No se publican en el grafo las URLs que todavía contienen `TODO` (Skool, Substack, YouTube, Spotify).

La serie usa el tipo de pódcast porque cada ficha tiene hueco de audio y de vídeo. Cuando el id de Spotify sea real, el episodio ya tiene la ficha; el `VideoObject` aparece solo con un id de YouTube real, para no anunciar un vídeo que no existe.

## Archivos de rastreo

- `public/robots.txt` permite todo y señala `https://cgamedia.cc/sitemap-index.xml`.
- `@astrojs/sitemap` genera ese índice en el build, con `es-ES` como idioma.
- `/rss.xml` lista los episodios (título, fecha, descripción, enlace a la ficha). No apunta a un vídeo pendiente.

## HTML

- Un `<h1>` por página. El de la portada es «Hablemos de dinero».
- Cabecera, `<main id="contenido">`, pie. Enlace «Saltar al contenido».
- El cambio de modo es un `radiogroup` con flechas.
- Formularios con `<label>`. Resultados en `aria-live="polite"`.
- Enlaces externos: `noopener noreferrer`. Afiliados: además `sponsored` y `nofollow`, más el aviso visible. No se marca `nofollow` una fuente pública (CNMV, AEAT, BIS): eso no es un anuncio.
- Contraste: el oro `#e4c37a` sobre `#070b16` pasa AAA en texto normal. El modo Abuelos sube a blanco sobre negro y oro más claro. `prefers-contrast: more` acerca la paleta a ese extremo. `prefers-reduced-motion` para el cielo y las órbitas.

## Velocidad

- CSS y fuentes propias, sin terceros en la primera carga.
- El cielo es un canvas pequeño y se detiene si la pestaña no se ve o si la persona pidió menos movimiento.
- YouTube y Spotify no se piden hasta el clic. Lighthouse no paga esos iframes en la portada.
- Sin analítica hasta pegar el token. Ver el README, sección F.
- Imágenes: el héroe es SVG. La única imagen raster de marca es `og.png`.

## Cómo comprobarlo

Después de `npm run build`:

```bash
# canónico y hreflang en la portada
grep -o 'rel="canonical"[^>]*' dist/index.html
grep hreflang dist/index.html

# la frase legal y la credencial siguen en el HTML
grep -R "no es asesoramiento financiero" dist --include='*.html' -l | head
grep -R "International Advanced Wealth Manager" dist/sobre/index.html
```

En el dominio ya publicado:

- [Rich Results Test](https://search.google.com/test/rich-results) con la portada, un episodio y un artículo del Laboratorio.
- PageSpeed o Lighthouse en la portada, en una calculadora y en un artículo del Laboratorio, móvil y escritorio.
- Search Console, cuando el dominio responda, para enviar `sitemap-index.xml`.

## Redirecciones que afectan al SEO

`www.cgamedia.cc` debe responder 301 hacia `https://cgamedia.cc` más la misma ruta. El README (paso C) lo deja como regla de Cloudflare. Un 301 estable evita contenido duplicado.

No cambies el `site` de `astro.config.mjs` si el dominio sigue siendo `cgamedia.cc`: de ahí salen el canónico, el sitemap y el RSS.
