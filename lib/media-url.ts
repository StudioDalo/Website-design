export function sizedImageUrl(src: string, width: number): string {
  if (
    !src.startsWith("https://cdn.sanity.io/images/") ||
    !Number.isInteger(width) ||
    width < 1
  )
    return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  url.searchParams.set("q", "82");
  return url.href;
}
