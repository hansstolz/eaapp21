import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  const id = parsePositiveId(body?.id);
  if (!body || !id || !["print", "mail"].includes(String(body.action))
    || typeof body.language !== "string" || !/^[A-Za-z_-]{1,40}$/.test(body.language)
    || !["original", "copy"].includes(String(body.version)) || body.documents !== "document")
    return errorResponse("Ungültige Dokumentanfrage.", 400);
  const mail = await prisma.ea_mails.findFirst({ where: { uid_mail: id, user_group: session.userGroup } });
  if (!mail) return errorResponse("Mail nicht gefunden.", 404);
  let email: { to: string[]; subject: string; text: string } | undefined;
  if (body.action === "mail") {
    const input = body.email as Record<string, unknown> | null;
    if (!input || typeof input !== "object" || Array.isArray(input)
      || typeof input.to !== "string" || typeof input.subject !== "string" || typeof input.text !== "string")
      return errorResponse("Ungültige E-Mail-Daten.", 400);
    const to = [...new Set(input.to.split(";").map(value => value.trim()).filter(Boolean))];
    if (!to.length || to.length > 3 || to.some(address => address.length > 254 || !/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(address)))
      return errorResponse("Bitte ein bis drei gültige E-Mail-Adressen durch Semikolon getrennt eingeben.", 400);
    email = { to, subject: input.subject, text: input.text };
  }
  try {
    const response = await fetch(`${(process.env.TEMPLATES_API_URL || "http://localhost:3001").replace(/\/$/, "")}/api/documents${email ? "/email" : ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.TEMPLATES_API_KEY ? { Authorization: `Bearer ${process.env.TEMPLATES_API_KEY}` } : {}) },
      body: JSON.stringify({ type: "mail", id, userGroup: session.userGroup, language: body.language, versions: [body.version], ...(email ? { email } : {}) }),
      cache: "no-store", signal: AbortSignal.timeout(90_000),
    });
    const result = await response.json();
    if (!response.ok) return errorResponse(result.error?.message || "Dokumentanfrage fehlgeschlagen.", response.status);
    if (email && (result.email?.status !== "accepted" || !Array.isArray(result.email?.accepted)
      || email.to.some(address => !result.email.accepted.includes(address)) || result.email?.rejected?.length))
      return errorResponse("Nicht alle Empfänger wurden vom Mailserver bestätigt. Bitte vor erneutem Versand den Versandstatus prüfen.", 502);
    const documents = email ? result.email?.documents : result.documents;
    if (!Array.isArray(documents) || !documents.length || documents.some(item => typeof item?.filename !== "string"))
      return errorResponse("Die Templates-API hat keine gültigen Dokumentdaten geliefert.", 502);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("Die Templates-API ist nicht erreichbar oder hat keine gültige Antwort geliefert. Bei E-Mail bitte vor erneutem Versand den Versandstatus prüfen.", 502);
  }
}
