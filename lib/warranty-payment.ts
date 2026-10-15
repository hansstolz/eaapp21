export function paymentCents(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const text = String(value).trim().replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return null;
  const cents = Math.round(Number(text) * 100);
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

export function remainingWarrantyCents(total: number | null, paid: number | null) {
  return Math.max(0, Math.round((total ?? 0) * 100) - Math.round((paid ?? 0) * 100));
}
