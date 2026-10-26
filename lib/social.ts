/** Only the owner's Instagram profile belongs in this public link field. */
export function instagramProfile(value: string) {
  if (!value.trim()) return null;
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    !["instagram.com", "www.instagram.com"].includes(url.hostname) ||
    url.port ||
    url.username ||
    url.password ||
    !/^\/[A-Za-z0-9_.]+\/?$/.test(url.pathname)
  ) {
    throw new Error(
      "Enter an HTTPS Instagram profile URL, such as https://www.instagram.com/studiodalo_london/.",
    );
  }
  const handle = url.pathname.split("/")[1];
  return { url: `https://www.instagram.com/${handle}/`, handle: `@${handle}` };
}
