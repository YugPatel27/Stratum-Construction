import manifest from '@/data/images.json';

const slugOf = (src) => src.replace(/^\/img\//, '').replace(/\.webp$/, '');

/** Responsive <img> props for a /img/<slug>.webp path: srcSet, intrinsic size (no layout shift). */
export function imgProps(src, sizes = '100vw') {
  const meta = manifest[slugOf(src)];
  if (!meta) return { src };
  const slug = slugOf(src);
  const srcSet = meta.small ? `/img/${slug}-${meta.small}.webp ${meta.small}w, /img/${slug}.webp ${meta.w}w` : undefined;
  return { src, srcSet, sizes: srcSet ? sizes : undefined, width: meta.w, height: meta.h, decoding: 'async' };
}
