# CGA Media

Sitio público de **CGA Media** (`https://cgamedia.cc`): educación financiera en español, con un modo de lectura para cada quien y un Laboratorio que no se simplifica.

El dueño es Carlos Gómez Artiles. Español, escribe desde Bangkok. Fundador único de CGA.

Frase que el pie no puede perder:

> Contenido educativo, no es asesoramiento financiero ni recomendación de inversión.

## Capturas

En `docs/capturas/`: la portada en modo Todos, la portada en modo Niños, la calculadora de interés compuesto, Misión Ahorro y el menú en el móvil.

## Arrancar en el ordenador

Hace falta Node.js 22 o más nuevo.

```bash
npm install
npm run dev
```

Abre [http://127.0.0.1:4477](http://127.0.0.1:4477).

Otros comandos:

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve esa carpeta `dist/` |
| `npm test` | Comprueba las cuentas y la lógica de los juegos |
| `npm run check:content` | Revisa que la credencial, el aviso y los TODO estén en su sitio |

## Cómo está hecho, en corto

Astro genera HTML estático. No hay base de datos ni servidor propio. Cloudflare solo entrega archivos. Las calculadoras y los juegos corren en el navegador.

El detalle está en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md). El SEO, en [docs/SEO.md](docs/SEO.md).

Hay cinco modos de lectura (Niños, Estudiantes, Padres, Abuelos, Todos). Cambian la letra, el contraste y las frases cortas. **El Laboratorio no es un sexto modo fácil:** los artículos de esa sala se leen siempre en modo pro. Si entras como Abuelos, allí solo crece la letra.

## Añadir un episodio

1. Crea `src/content/episodes/mi-episodio.md`. El nombre del archivo es la dirección: `/episodios/mi-episodio/`.
2. Copia esta cabecera y rellena las cinco frases. La de niños va en corto. La de «todos» es la general.

```yaml
---
title: Título del episodio
description: Una frase para Google y para la ficha. Máximo unas 160 letras.
pubDate: 2026-12-01
season: 1
episode: 5
duration: 20 min
mediaKey: ep-nuevo
tags:
  - ahorro
tools:
  - interes-compuesto
summary:
  ninos: Frase corta.
  estudiantes: Frase con el término, si hace falta.
  padres: Frase de casa.
  abuelos: Frase muy simple.
  todos: Frase general, sin humo.
---
```

3. Debajo, escribe `## Notas` y, al final, `## Transcripción`. Si aún no hay transcripción, deja la frase «Pendiente».
4. Abre **solo** `src/config/site.ts` y añade la clave dentro de `media`:

```ts
'ep-nuevo': { youtubeId: 'TODO_YT_EP05', spotifyId: 'TODO_SP_EP05' },
```

Cuando tengas los identificadores reales, sustituye los TODO. Mientras la palabra TODO siga ahí, la ficha enseña el hueco y no llama a YouTube ni a Spotify.

`tools` acepta el slug de una calculadora (`interes-compuesto`), de un juego (`planeta-compuesto`) o de una herramienta del Laboratorio (`tamano-posicion`).

## Añadir una noticia

Crea `src/content/news/mi-nota.md`. No hay robot que las traiga: si no está el archivo, no está en la web.

```yaml
---
title: Título
description: De qué va, en una frase.
pubDate: 2026-12-01
source: CNMV
url: https://www.cnmv.es/
topic: Mercados
---
```

El cuerpo es tu nota. `url` tiene que ser la fuente de verdad (un organismo, una norma, un papel). No pongas ahí un enlace pendiente: los pendientes viven en `src/config/site.ts`.

## Añadir un socio

Edita el array `partners` en `src/config/site.ts`.

- `example: true` sale en «Así se verá una ficha» y no cuenta como acuerdo.
- `example: false` sale en la lista real.
- `affiliate: true` obliga al enlace `rel="sponsored nofollow"` y al aviso de comisión, visible, al lado del enlace.
- La URL, si aún no es la definitiva, lleva `TODO` en la propia dirección.

No publiques una marca seria como si hubiera acuerdo. Vacío y honesto es mejor que un logo prestado.

## Añadir un artículo del Laboratorio

Crea `src/content/laboratorio/mi-articulo.md`.

```yaml
---
title: Título
description: Una frase densa, para la ficha y para Google.
pubDate: 2026-12-01
minutes: 10
kicker: Tema
topics:
  - Una etiqueta
tools:
  - tamano-posicion
---
```

El cuerpo no se traduce a lenguaje de niños. Si el tema tiene una versión corta para todo el mundo, esa versión es un workflow en `src/content/workflows/`, y desde allí enlazas el artículo.

## Enlaces que todavía son un hueco

Todos están en **`src/config/site.ts`**, marcados con `TODO`:

- comunidad gratuita Despacho CGA (Skool)
- tier de pago Despacho
- tier de pago Mesa CGA
- newsletter CGA Brief (Substack)
- canal de YouTube y programa de Spotify
- identificadores de cada episodio
- formulario Formspree, si quieres usarlo (vacío = se abre un correo)
- token de Cloudflare Web Analytics (vacío = no hay analítica)
- fichas de socio de ejemplo

Busca `TODO` en ese archivo antes de dar el dominio por cerrado. El aviso legal también tiene una lista (`legalTodos`): NIF y domicilio no se inventan.

## Desplegar en Cloudflare

El dominio `cgamedia.cc` ya está en Cloudflare. El sitio es estático: el plan gratuito basta. No hace falta una base de datos ni un servidor de pago.

Hay dos caminos. Los dos sirven la carpeta `dist/`. Empieza por el A si quieres que cada `git push` publique solo.

### 0. Antes de los dos caminos

En tu ordenador:

```bash
npm install
npm test
npm run build
```

Si `npm run build` termina sin error, `dist/` es el sitio.

Node en Cloudflare tiene que ser 22. En Pages se elige en *Settings → Build → Environment variables* o en la versión de Node del proyecto. Este repo pide `>=22` en `package.json`.

### A. Cloudflare Pages, conectado a Git

Es el camino más simple cuando el código vive en GitHub o en el git que ya uses.

1. Entra en [dash.cloudflare.com](https://dash.cloudflare.com).
2. *Workers & Pages → Create → Pages → Connect to Git*.
3. Elige este repositorio y la rama que quieras publicar (normalmente `main`).
4. Configura la build así:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (la raíz del repo)
5. Guarda y deja que el primer despliegue acabe en verde.
6. *Custom domains → Set up a domain*:
   - añade `cgamedia.cc`
   - añade `www.cgamedia.cc`
7. Cloudflare crea los registros DNS solo, porque la zona ya es suya. Espera a que los dos digan *Active*.

El archivo `public/_redirects` pide que `www` vaya a la raíz sin www. Si Pages no lo aplica entre dominios, haz la redirección a mano (paso C).

### B. Cloudflare Workers, con Wrangler

Sirve si publicas desde tu ordenador, sin conectar Git.

1. Instala sesión (una vez):

```bash
npx wrangler login
```

Se abre el navegador para autorizar.

2. Cada vez que quieras publicar:

```bash
npm run build
npx wrangler deploy
```

`wrangler.jsonc` ya dice que los archivos están en `./dist` y que el worker se llama `cgamedia`.

3. En el panel: *Workers & Pages → cgamedia → Settings → Domains & Routes → Add → Custom domain*. Añade `cgamedia.cc` y después `www.cgamedia.cc`.

### C. Que www y la raíz no sean dos sitios

La dirección canónica es `https://cgamedia.cc` (sin www).

1. *Rules → Redirect Rules → Create rule*.
2. Nombre: `www a raiz`.
3. Si el nombre de host es `www.cgamedia.cc`.
4. Entonces: *Dynamic redirect*, código **301**, expresión:

```txt
concat("https://cgamedia.cc", http.request.uri.path)
```

5. Actívala.

Así un enlace viejo con www no divide el SEO en dos.

### D. SSL

Con el dominio en Cloudflare el certificado de borde es automático (Universal SSL). No compras nada.

Cuando el dominio ya está *Active*:

1. *SSL/TLS → Overview → Full (strict)*. En Pages y en Workers el origen también es Cloudflare, y este modo es el correcto.
2. *SSL/TLS → Edge Certificates → Always Use HTTPS*: activado.
3. No desactives el HTTPS automático «para probar». El sitio está pensado para `https://`.

La primera emisión del certificado puede tardar unos minutos. Si el navegador se queja, espera y recarga. No subas un certificado tuyo.

### E. Correo `carlos@cgamedia.cc`

Email Routing reenvía. No es un buzón con webmail: el correo llega a una bandeja que tú ya tienes (Gmail u otra).

1. En la zona `cgamedia.cc`: *Email → Email Routing*.
2. *Enable Email Routing*. Si el dominio no tenía correo, acepta que Cloudflare escriba los registros MX y el SPF. Si ya tenías otro correo en este dominio, parar aquí y no pises esos MX.
3. *Destination addresses → Add*. Pon tu bandeja personal. Abre el correo de verificación y confírmalo.
4. *Routing rules → Create address*.
   - Custom address: `carlos`
   - Dominio: `cgamedia.cc`
   - Action: *Send to* tu bandeja verificada.
5. Mándate un correo de prueba desde otra cuenta a `carlos@cgamedia.cc`.

Ese mismo buzón es el que usa el formulario del Estudio cuando Formspree está vacío: el botón abre `mailto:carlos@cgamedia.cc`.

### F. Web Analytics, si lo quieres

Por defecto no hay analítica ni cookies de seguimiento.

1. En la zona: *Analytics & logs → Web Analytics → Add a site*. Elige `cgamedia.cc`.
2. Copia el token del beacon (no hace falta pegar el script a mano).
3. En `src/config/site.ts`, pega el token en `cloudflareWebAnalyticsToken`.
4. Vuelve a desplegar.

Vacío = el script no se imprime. El de Cloudflare está pensado sin cookies; aun así no se carga hasta que el token exista. La política de privacidad lo dice.

### G. Después del primer despliegue

- Abre `https://cgamedia.cc` y `https://www.cgamedia.cc` (el segundo debe saltar al primero).
- Mira el pie: la frase educativa tiene que estar entera.
- Busca `TODO` en la portada. Es normal hasta que sustituyas Skool, Substack y los vídeos.
- Completa NIF y domicilio en el aviso legal antes de tratar esa página como cerrada.

## Créditos de la persona, tal cual

En Sobre se muestra esta línea, sin parafrasear:

`BBA (Finance) candidate · International Advanced Wealth Manager, Level 4 · UK graduate · Founder, CGA`
