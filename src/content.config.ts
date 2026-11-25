import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const copy = z.object({
  ninos: z.string().min(1),
  estudiantes: z.string().min(1),
  padres: z.string().min(1),
  abuelos: z.string().min(1),
  todos: z.string().min(1),
});

const episodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/episodes' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    season: z.number().int().positive(),
    episode: z.number().int().positive(),
    duration: z.string().min(1),
    mediaKey: z.string().min(1),
    tags: z.array(z.string()),
    tools: z.array(z.string()),
    summary: copy,
    draft: z.boolean().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    source: z.string().min(1),
    url: z.string().url(),
    topic: z.string().min(1),
  }),
});

const workflows = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/workflows' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    order: z.number().int(),
    summary: copy,
    tools: z.array(z.string()),
  }),
});

const laboratorio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/laboratorio' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    minutes: z.number().int().positive(),
    kicker: z.string().min(1),
    topics: z.array(z.string()),
    tools: z.array(z.string()),
  }),
});

export const collections = { episodes, news, workflows, laboratorio };
