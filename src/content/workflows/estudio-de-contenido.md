---
title: Estudio de contenido con IA
description: El recorrido de un episodio, de la idea a la ficha en esta web. La IA propone. La firma es de una persona.
order: 1
tools: []
summary:
  ninos: Carlos prepara los vídeos con ayuda de máquinas, y luego lo revisa él. La máquina no manda.
  estudiantes: Pipeline de una pieza. Fuentes, guion, grabación, corte y la página del episodio en markdown.
  padres: Cómo se hace un episodio sin convertir la herramienta en el autor.
  abuelos: Primero la idea. Luego la máquina ayuda. Al final lo mira una persona.
  todos: Un flujo de estudio. La IA acelera el borrador y no sustituye la revisión ni la fuente.
---

Un episodio de CGA no empieza en el editor de vídeo. Empieza en una frase que se puede defender sin música: qué idea es, para quién, y qué no va a prometer.

El orden que uso es este.

1. **Fuentes.** Si el tema toca una norma o una cifra, el enlace es el del organismo. Un resumen de un blog no cuenta como fuente aunque esté bien escrito.
2. **Esquema.** Tres o cuatro bloques. Si no cabe en una página, el episodio se está yendo a dos.
3. **Borrador con IA.** Le pido un guion a partir del esquema y de las fuentes que yo he pegado. Si no le doy la fuente, inventa. Por eso no se le pide «explícame el modelo 721» a pelo.
4. **Revisión humana.** Nombres, cifras, fechas y el tono. Quito cualquier frase que suene a recomendación de compra. Compruebo que no haya una cita que yo no haya leído.
5. **Grabación y corte.** La voz es la mía. Un doblaje sintético, si algún día se usa en un anuncio del estudio, se dice. En los episodios no.
6. **Ficha.** Un archivo markdown en `src/content/episodes`, con la idea corta para cada modo de lectura y la transcripción cuando existe. El identificador de YouTube y de Spotify no va en el markdown: va en `src/config/site.ts`.

La miniatura no promete un resultado. «Cómo no perder» es un título de casino, no de una clase. Si la pieza es un encargo del Estudio, el mismo filtro vale para el cliente: no produzco un anuncio que garantice una rentabilidad.

La versión larga de este método está en el [Laboratorio](/laboratorio/estudio-con-ia/).
