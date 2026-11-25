---
title: El estudio con IA, visto desde la mesa de corte
description: El pipeline real de una pieza de CGA. Dónde entra el modelo, dónde se le prohíbe inventar y cómo acaba eso en un markdown.
pubDate: 2026-11-18
minutes: 8
kicker: Estudio
topics:
  - IA
  - Producción
  - Archivo
tools: []
---

Uso modelos de lenguaje como se usa una mesa de corte: para ir más rápido sobre un material que ya existe. No como una fuente. La diferencia es operativa y se puede auditar.

Un episodio o un artículo de esta web sigue el mismo carril.

1. La frase que tiene que sobrevivir sin adjetivos. Si no cabe, no hay pieza.
2. Las fuentes, pegadas. Norma, estadística, papel. Si no hay enlace, no hay párrafo con cifra.
3. Un esquema de bloques. El modelo puede proponer otro; el esquema manda.
4. Un borrador. Se le pide que no añada datos que no estén en el material. Aun así lo intenta. Por eso el paso 5 no es opcional.
5. Lectura en voz, con las cifras al lado. Se borra cualquier frase que suene a «deberías comprar», cualquier cita que yo no haya visto y cualquier fecha redonda sospechosa.
6. Grabación con mi voz, o un texto firmado. Un avatar o una voz sintética, en un encargo del Estudio, se declara. En el archivo educativo no se usa para sustituirme.
7. Publicación como markdown. El episodio nuevo es un archivo en `src/content/episodes` más una línea de identificadores en `src/config/site.ts`. El artículo de esta sala es solo el archivo. No hay un panel opaco.

## Fallos que ya he visto en borradores

El modelo cita un artículo del BOE que no existe, con un número verosímil. Atribuye a un supervisor una frase que es de un blog. Redondea un umbral fiscal «para que quede claro» y el umbral deja de ser el de la norma. Suaviza una cautela porque suena antipática. Los cuatro se corrigen leyendo, no pidiendo «hazlo más preciso» en abstracto.

La miniatura y el título pasan el mismo filtro que el guion. Una miniatura que prometa un resultado es un anuncio, y de los que el Estudio no produce. Lo digo también del lado comercial: si un cliente quiere una pieza que garantice una rentabilidad, el encargo no sale.

El flujo corto, el que se puede seguir sin esta sala, está en [Estudio de contenido con IA](/workflows/estudio-de-contenido/). Las dos páginas dicen la misma cosa: la firma es de una persona. El modelo no tiene responsabilidad civil, ni criterio, ni un nombre en el aviso legal.
