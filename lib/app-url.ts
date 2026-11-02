/** Use the canonical public origin behind a reverse proxy. */
export function getAppOrigin(requestUrl: string): string {
  const url = new URL(process.env.APP_URL || requestUrl);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("APP_URL must be an HTTP or HTTPS URL");
  }
  return url.origin;
}
