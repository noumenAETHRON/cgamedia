export const audiences = ['ninos', 'estudiantes', 'padres', 'abuelos', 'todos'] as const;

export type Audience = (typeof audiences)[number];

export type AudienceCopy = Record<Audience, string>;

export function same(text: string): AudienceCopy {
  return {
    ninos: text,
    estudiantes: text,
    padres: text,
    abuelos: text,
    todos: text,
  };
}

export function vary(copy: AudienceCopy): AudienceCopy {
  return copy;
}

export function lookupCopy(tree: unknown, path: string): AudienceCopy {
  const value = path.split('.').reduce<unknown>((node, key) => {
    if (node && typeof node === 'object' && key in node) {
      return (node as Record<string, unknown>)[key];
    }
    return undefined;
  }, tree);

  if (!value || typeof value !== 'object') {
    throw new Error(`Falta el texto «${path}»`);
  }

  const copy = value as Partial<AudienceCopy>;
  for (const mode of audiences) {
    if (typeof copy[mode] !== 'string' || copy[mode].length === 0) {
      throw new Error(`Falta el texto «${path}» para el modo ${mode}`);
    }
  }
  return copy as AudienceCopy;
}
