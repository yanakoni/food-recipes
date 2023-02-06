const createDynamicPath = (pathWithSlug: string, slugs: string[]) => {
  const pathParts = pathWithSlug.split('/:');
  const pathRoot = pathParts[0];

  return `${pathRoot}/${slugs.join('/')}`;
};

export { createDynamicPath };
