// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Sitio estático. El inglés se añade sumando 'en' a locales y rutas /en/.
export default defineConfig({
  site: 'https://cgamedia.cc',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    inlineStylesheets: 'never',
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES' },
      },
    }),
  ],
  server: {
    port: 4477,
    host: '127.0.0.1',
  },
  devToolbar: {
    enabled: false,
  },
});
