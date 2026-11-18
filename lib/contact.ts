export function enquiryEmailHref(email: string, subject: string) {
  return `mailto:${encodeURIComponent(email).replace("%40", "@")}?subject=${encodeURIComponent(subject)}`;
}
