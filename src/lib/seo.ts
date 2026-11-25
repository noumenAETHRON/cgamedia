import { founder, site } from '../config/site.ts';
import { absolute } from './urls.ts';

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: `${site.url}/`,
    email: site.email,
    description: site.description,
    logo: absolute('/favicon.svg'),
    founder: { '@id': `${site.url}/sobre/#carlos` },
    knowsLanguage: ['es'],
  };
}

export function personNode() {
  return {
    '@type': 'Person',
    '@id': `${site.url}/sobre/#carlos`,
    name: founder.name,
    url: absolute('/sobre/'),
    email: `mailto:${founder.email}`,
    description: founder.credential,
    homeLocation: { '@type': 'Place', name: founder.location },
    nationality: { '@type': 'Country', name: 'España' },
    jobTitle: 'Founder, CGA',
    worksFor: { '@id': `${site.url}/#organization` },
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: `${site.url}/`,
    inLanguage: 'es-ES',
    description: site.description,
    publisher: { '@id': `${site.url}/#organization` },
  };
}

export function breadcrumbNode(items: { name: string; href?: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: absolute(item.href) } : {}),
    })),
  };
}

export function graph(nodes: unknown[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
