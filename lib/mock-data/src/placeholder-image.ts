/**
 * @farish/mock-data — offline placeholder-image generator.
 *
 * Produces an inline SVG `data:` URI. This keeps the app fully browser-only:
 * no network request, no third-party placeholder service, works offline and in
 * CI screenshots. Ideal for the ghost wireframes behind Coming Soon pages.
 */

/** Options for {@link placeholderImageUrl}. */
export interface PlaceholderImageOptions {
  /** Image width in pixels. Default 320. */
  width?: number;
  /** Image height in pixels. Default 240. */
  height?: number;
  /** Centered label text. Default is the dimensions, e.g. `320×240`. */
  label?: string;
  /** Background fill colour (any CSS colour). Default `#cfd8dc`. */
  background?: string;
  /** Label text colour. Default `#546e7a`. */
  foreground?: string;
}

/**
 * Build a placeholder image as an SVG `data:` URI.
 *
 * The result can be assigned directly to an `<img src>` or a CSS
 * `background-image`. Because it is a data URI, it never touches the network.
 *
 * @returns A `data:image/svg+xml,...` URI string.
 */
export function placeholderImageUrl(
  options: PlaceholderImageOptions = {},
): string {
  const width = options.width ?? 320;
  const height = options.height ?? 240;
  const label = options.label ?? `${String(width)}×${String(height)}`;
  const background = options.background ?? '#cfd8dc';
  const foreground = options.foreground ?? '#546e7a';
  const fontSize = Math.max(12, Math.round(Math.min(width, height) / 8));

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${String(width)}" height="${String(height)}" viewBox="0 0 ${String(width)} ${String(height)}">`,
    `<rect width="100%" height="100%" fill="${background}"/>`,
    `<text x="50%" y="50%" fill="${foreground}" font-family="sans-serif" font-size="${String(fontSize)}" text-anchor="middle" dominant-baseline="middle">${label}</text>`,
    '</svg>',
  ].join('');

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
