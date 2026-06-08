/** GitHub Pages subpath, empty in local dev. Set at build time via next.config env. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function staticAsset(assetPath: string): string {
  const normalized = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${BASE_PATH}${normalized}`;
}
