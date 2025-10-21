export const ToStringUtils = {
  toString: (obj: unknown): string => {
    if (obj === null || obj === undefined) return '<null>';

    const type = typeof obj;
    if (
      type === 'string' ||
      type === 'number' ||
      type === 'boolean' ||
      type === 'symbol' ||
      type === 'bigint'
    ) {
      return `<${type}> ${String(obj as string | number | boolean | symbol | bigint)}`;
    }
    const entries = Object.entries(obj as object);
    const entriesString = entries
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    const typeName: string =
      typeof obj === 'object'
        ? ((Object.getPrototypeOf(obj) as { constructor?: { name?: string } })
            ?.constructor?.name as string) || 'Object'
        : typeof obj;

    return `${typeName} { ${entriesString} }`;
  },
};
