/**
 * ÚNICO archivo de enlaces pendientes.
 * Busca «TODO» y sustituye cada valor antes de dar el sitio por publicado.
 * No copies estas URLs a otros archivos: las páginas leen este módulo.
 */

export const site = {
  name: 'CGA Media',
  url: 'https://cgamedia.cc',
  locale: 'es',
  seriesName: 'Hablemos de dinero',
  email: 'carlos@cgamedia.cc',
  description:
    'Educación financiera en español para cualquier punto de partida. Episodios, calculadoras, juegos y un laboratorio para quien quiera ir más lejos.',
} as const;

export const founder = {
  name: 'Carlos Gómez Artiles',
  credential:
    'BBA (Finance) candidate · International Advanced Wealth Manager, Level 4 · UK graduate · Founder, CGA',
  location: 'Bangkok',
  email: site.email,
} as const;

/** Frase obligatoria. No la reformules en el pie ni en las páginas legales. */
export const disclaimer =
  'Contenido educativo, no es asesoramiento financiero ni recomendación de inversión';

export const disclaimerExtra =
  'CGA Media no está autorizada por la CNMV para prestar servicios de inversión. Nada de lo publicado es una oferta ni una recomendación personalizada.';

export const links = {
  /** TODO: comunidad gratuita de Skool. Nombre público: Despacho CGA. */
  skoolFree: 'https://www.skool.com/TODO-despacho-cga',
  /**
   * TODO: tier de pago «Despacho» en Skool.
   * Si vive dentro de la misma comunidad, pega el enlace de acceso o de pago que da Skool.
   */
  skoolDespacho: 'https://www.skool.com/TODO-despacho-pago',
  /** TODO: tier de pago «Mesa CGA» en Skool. */
  skoolMesa: 'https://www.skool.com/TODO-mesa-cga',
  /** TODO: newsletter CGA Brief en Substack. */
  substack: 'https://TODO-cgabrief.substack.com',
  /** TODO: canal de YouTube de CGA Media. */
  youtubeChannel: 'https://www.youtube.com/@TODO-cgamedia',
  /** TODO: programa de Spotify. */
  spotifyShow: 'https://open.spotify.com/show/TODOSPOTIFYSHOW',
  /**
   * TODO: endpoint de Formspree (https://formspree.io/f/xxxxxxxx).
   * Vacío = el formulario abre un correo a carlos@cgamedia.cc.
   */
  formspreeEndpoint: '',
  /**
   * TODO: token de Cloudflare Web Analytics.
   * Vacío = no se carga ningún beacon.
   */
  cloudflareWebAnalyticsToken: '',
  /** TODO: perfil de X, si se usa. Vacío = no se muestra. */
  x: '',
  /** TODO: perfil de LinkedIn, si se usa. Vacío = no se muestra. */
  linkedin: '',
} as const;

/**
 * IDs de YouTube y Spotify por episodio.
 * La ficha del episodio (markdown) solo guarda `mediaKey`.
 * Un valor con TODO no incrusta el reproductor: muestra el hueco.
 */
export const media = {
  'ep-hablemos': { youtubeId: 'TODO_YT_EP01', spotifyId: 'TODO_SP_EP01' },
  'ep-interes-compuesto': { youtubeId: 'TODO_YT_EP02', spotifyId: 'TODO_SP_EP02' },
  'ep-fondo-emergencia': { youtubeId: 'TODO_YT_EP03', spotifyId: 'TODO_SP_EP03' },
  'ep-necesidades-deseos': { youtubeId: 'TODO_YT_EP04', spotifyId: 'TODO_SP_EP04' },
} as const;

export type MediaKey = keyof typeof media;

export const community = {
  free: {
    label: 'Despacho CGA',
    priceNote: 'Gratuito',
    href: links.skoolFree,
    blurb: 'La comunidad abierta. Para entrar, preguntar y seguir los episodios sin pagar.',
  },
  despacho: {
    label: 'Despacho',
    priceNote: 'De pago',
    href: links.skoolDespacho,
    blurb: 'Sala de trabajo para quien quiere aplicar los temas del Laboratorio con más rigor.',
  },
  mesa: {
    label: 'Mesa CGA',
    priceNote: 'De pago',
    href: links.skoolMesa,
    blurb: 'La mesa más estrecha. Estudio, no señales y no gestión de patrimonio.',
  },
} as const;

export type Partner = {
  id: string;
  name: string;
  category: string;
  blurb: string;
  href: string;
  affiliate: boolean;
  /** true = ficha de muestra. No es un acuerdo real. */
  example: boolean;
};

export const partners: Partner[] = [
  {
    id: 'ejemplo-custodia',
    name: 'Custodio regulado (ejemplo)',
    category: 'Custodia',
    blurb:
      'Plaza reservada para una casa de custodia con licencia y cuentas claras. Esta ficha no representa un acuerdo.',
    href: 'https://TODO-socio-custodia.example',
    affiliate: true,
    example: true,
  },
  {
    id: 'ejemplo-datos',
    name: 'Datos de mercado (ejemplo)',
    category: 'Datos',
    blurb:
      'Plaza reservada para un proveedor de datos con metodología pública. No es un socio real.',
    href: 'https://TODO-socio-datos.example',
    affiliate: true,
    example: true,
  },
  {
    id: 'ejemplo-patrocinio',
    name: 'Patrocinio editorial (ejemplo)',
    category: 'Patrocinio',
    blurb:
      'Un patrocinio se marca como tal y no lleva comisión por clic. Tampoco es una recomendación de producto.',
    href: 'https://TODO-patrocinio.example',
    affiliate: false,
    example: true,
  },
];

/** Datos que el aviso legal no debe inventar. Complétalos antes de tratar la página como definitiva. */
export const legalTodos = [
  'TODO: NIF, NIE o documento equivalente',
  'TODO: domicilio a efectos del aviso legal',
  'TODO: si más adelante hay sociedad, razón social y datos registrales. Hoy CGA Media se presenta a nombre de su fundador, como persona.',
] as const;

export function isPlaceholder(href: string | undefined | null): boolean {
  if (!href) return false;
  return href.includes('TODO');
}

export function definedLink(href: string): string | undefined {
  if (!href || href.includes('TODO')) return undefined;
  return href;
}
