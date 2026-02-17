/**
 * Converts X/Twitter profile image URL to high-resolution (400x400) to avoid pixelation.
 * Twitter returns _normal (48x48) by default; we request _400x400.
 */
export function getHighResAvatarUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return url ?? '';
  if (url.includes('pbs.twimg.com') && url.includes('_normal')) {
    return url.replace(/_normal(\.\w+)?$/i, '_400x400$1');
  }
  if (url.includes('pbs.twimg.com') && !url.includes('_400x400') && !url.includes('_normal')) {
    return url.replace(/(\.\w+)$/, '_400x400$1');
  }
  return url;
}
