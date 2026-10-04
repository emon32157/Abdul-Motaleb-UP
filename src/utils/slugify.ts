export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\u0980-\u09FF-]+/g, '') // Remove characters except alphanumeric, Bengali unicode, and dashes
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function getProjectSlug(project: { id: string; title: string; slug?: string }): string {
  if (project.slug && project.slug.trim()) {
    return slugify(project.slug);
  }
  return slugify(project.title) || project.id;
}

export function getCertificateSlug(cert: { id: string; title: string; slug?: string }): string {
  if (cert.slug && cert.slug.trim()) {
    return slugify(cert.slug);
  }
  return slugify(cert.title) || cert.id;
}
