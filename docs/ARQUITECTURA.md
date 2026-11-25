# Arquitectura

CGA Media es un sitio estático. Astro lee markdown y TypeScript, y escribe HTML, CSS y un poco de JavaScript en `dist/`. Cloudflare entrega esos archivos. No hay base de datos, ni login, ni API propia.

## Por qué este stack

- **Astro**, salida `static`. Cada página es HTML. El JavaScript viaja solo donde hay una calculadora, un juego, el cielo de estrellas o el cambio de modo.
- **Sin Tailwind y sin librería de componentes.** El diseño es CSS propio (`src/styles/global.css` y, solo en el Laboratorio, `src/styles/lab.css`) para poder controlar el contraste y la letra de cada modo.
- **Fuentes en el propio sitio** (`@fontsource`): Fraunces y Outfit en toda la web; IBM Plex Sans y Mono solo en el Laboratorio. No hay llamada a Google Fonts.
- **Despliegue gratis en Cloudflare.** El repo público es `noumenAETHRON/cgamedia`. `wrangler.jsonc` ejecuta `npm run build` y publica `./dist` (Workers Builds). Si el panel pide carpeta de salida, es `dist`. Node 22. GitHub Actions (`.github/workflows/ci.yml`) corre tests y build en cada push.

## Mapa de carpetas

```text
src/config/site.ts          enlaces pendientes (el único sitio con TODO en URLs)
src/config/tools.ts         las 7 calculadoras públicas y sus textos por modo
src/config/lab-tools.ts     las 4 herramientas del Laboratorio
src/config/games-meta.ts    fichas de los 3 juegos
src/content/episodes/       episodios (markdown)
src/content/news/           noticias curadas (markdown)
src/content/workflows/      métodos, versión general
src/content/laboratorio/    artículos de modo pro
src/content/enlaces.json    directorio público de salida
src/content/recursos-pro.json   fuentes del Laboratorio
src/content.config.ts       esquemas de las colecciones
src/i18n/es.ts              textos de interfaz
src/i18n/en.ts              hueco para el inglés (aún no traduce)
src/lib/finance.ts          cuentas puras, sin DOM
src/lib/games.ts            reglas de los juegos, sin DOM
src/pages/                  una ruta por archivo
public/                     favicon, robots, cabeceras, og.png
```

## Colecciones

Astro 5+ (aquí, Astro 7) usa `src/content.config.ts` y el loader `glob`.

| Colección | Carpeta | Dirección |
| --- | --- | --- |
| `episodes` | `src/content/episodes` | `/episodios/[id]/` |
| `news` | `src/content/news` | se listan todas en `/noticias/` |
| `workflows` | `src/content/workflows` | `/workflows/[id]/` |
| `laboratorio` | `src/content/laboratorio` | `/laboratorio/[id]/` |

El `id` es el nombre del archivo sin `.md`. Un borrador de episodio (`draft: true` en la cabecera) no genera página.

Los identificadores de YouTube y Spotify **no** van en el markdown. Van en `media` dentro de `site.ts`, y el episodio solo guarda `mediaKey`. Así los huecos TODO están en un solo archivo. Si el identificador contiene `TODO`, no se incrusta el reproductor.

## Modos de lectura

Cinco valores: `ninos`, `estudiantes`, `padres`, `abuelos`, `todos`.

1. `public/scripts/audience-boot.js` corre en el `<head>`, antes de pintar, y pone `data-audience` en `<html>` desde `localStorage` (`cga-audience`). La primera visita es `todos`.
2. El CSS enseña una sola variante de cada frase (`.copy-variant`) y cambia tamaño, contraste y navegación. Abuelos: letra grande, fondo negro, menos enlaces en la barra (el resto está en «Más secciones»), sin el dibujo que gira. Niños: letra algo mayor y radios más redondos.
3. `src/scripts/audience.ts` guarda la elección y avisa a las calculadoras con el evento `cga-audience`, para que las etiquetas del resultado se puedan acortar.

Las frases de interfaz están en `src/i18n/es.ts`. Las de un episodio o un workflow están en la cabecera del markdown (`summary` con las cinco claves). El cuerpo largo del markdown es uno: el general. En niños, ese cuerpo avisa de que está escrito para mayores. No hay cinco artículos paralelos, porque se desactualizarían distinto.

El modo no cambia la URL. Google indexa el HTML completo, con la variante «todos» visible por defecto en el primer HTML y el resto en el mismo documento, oculto por CSS hasta que el script de cabecera elige. No es una puerta trasera de palabras clave: son la misma idea dicha más simple, y el título `<title>` no cambia con el modo.

## Laboratorio

Rutas bajo `/laboratorio/`. Usan `LabLayout`, que carga `lab.css` y marca `data-zone="lab"`.

- Los artículos no tienen `summary` por modo. No existe versión reducida.
- Las herramientas (tamaño de posición, volatilidad, DCA, rendimiento tokenizado) usan lenguaje de mesa siempre. La fórmula se ve también si el modo de letra es Abuelos: `lab.css` fuerza `.formula { display: block }`.
- Las salas de pago (Despacho y Mesa CGA) solo se presentan aquí, más la comunidad gratuita en la portada. Los tres URL salen de `site.ts`. No hay precios inventados.

## Calculadoras y juegos

`src/lib/finance.ts` y `src/lib/games.ts` no tocan el DOM. Los tests (`npm test`) los ejecutan con el runner de Node. El script de la página solo lee el formulario, llama a la función y pinta texto (nada de `innerHTML` con lo que escribió la persona).

Ningún campo sale del navegador. No hay `fetch` de las cifras.

Los reproductores de YouTube (`youtube-nocookie`) y Spotify se crean al pulsar. Hasta entonces no hay iframe.

## Legal y analítica

El disclaimer exacto y la credencial viven en `site.ts` y se imprimen desde ahí. `scripts/check-content.mjs` falla si la credencial no está, si el disclaimer no se usa, o si una URL con `TODO` aparece fuera de `site.ts`.

`cloudflareWebAnalyticsToken` vacío no imprime el beacon. `formspreeEndpoint` vacío hace que el formulario del Estudio abra un `mailto:`.

## Cabeceras

`public/_headers` lo copia el build a `dist/` y lo entiende Cloudflare Pages: nosniff, referrer, frame, HSTS y una CSP que permite el propio JS, el beacon opcional de Cloudflare, y los iframes de YouTube y Spotify solo después del clic. Los estilos pueden ir en línea (`style-src 'unsafe-inline'`) para no romper el CSS que Astro deje embebido. Los scripts de página son archivos, no bloques inline, salvo el beacon si algún día se activa.

## Inglés, cuando toque

1. Traducir las claves de `src/i18n/es.ts` en `src/i18n/en.ts`.
2. Añadir `'en'` a `i18n.locales` y al sitemap en `astro.config.mjs`.
3. Decidir el prefijo `/en/` (recomendado: `prefixDefaultLocale: false`, así el español sigue en la raíz).
4. Añadir `<link rel="alternate" hreflang="en">` en `BaseLayout.astro`. Hoy solo están `es` y `x-default`, los dos apuntando a la URL española.

No hace falta rehacer las colecciones: se puede añadir un campo `locale` más adelante o una carpeta `episodes/en`. Hasta entonces el sitio es una sola lengua a propósito.
