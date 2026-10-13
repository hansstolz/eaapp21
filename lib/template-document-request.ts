import { getAuthSession } from "@/lib/auth-session";
import { findOwnedCostestimate, findOwnedOrder } from "@/lib/order-detail";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";
import { prisma } from "@/lib/prisma";

export async function handleDocumentRequest(request: Request, type: "costestimate" | "invoice" | "creditnote") {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  const id = parsePositiveId(body?.id);
  if (!body || !id || !["print", "mail"].includes(String(body.action)))
    return errorResponse("Ungültige Dokumentanfrage.", 400);
  if (typeof body.language !== "string" || !/^[A-Za-z_-]{1,40}$/.test(body.language)
    || !["original", "copy"].includes(String(body.version))
    || !["document", "document-and-client", "client"].includes(String(body.documents)))
    return errorResponse("Ungültige Dokumentoptionen.", 400);
  if (type === "creditnote" && body.documents !== "document")
    return errorResponse("Für Gutschriften ist nur das Gutschrift-Dokument verfügbar.", 400);
  const document = type === "costestimate"
    ? await findOwnedCostestimate(id, session.userGroup)
    : await findOwnedOrder(id, session.userGroup);
  if (!document) return errorResponse(type === "costestimate" ? "Costestimate nicht gefunden." : "Auftrag nicht gefunden.", 404);
  const order = await findOwnedOrder(type === "costestimate" ? document.uid_order : id, session.userGroup);
  if (!order) return errorResponse("Auftrag nicht gefunden.", 404);
  let email: { to: string[]; subject: string; text: string } | undefined;
  if (body.action === "mail") {
    const input = body.email;
    if (!input || typeof input !== "object" || Array.isArray(input))
      return errorResponse("Ungültige E-Mail-Daten.", 400);
    const value = input as Record<string, unknown>;
    if (typeof value.to !== "string" || typeof value.subject !== "string" || typeof value.text !== "string")
      return errorResponse("Ungültige E-Mail-Daten.", 400);
    const recipients = [...new Set(value.to.split(";").map((address) => address.trim()).filter(Boolean))];
    if (!recipients.length || recipients.length > 3 || recipients.some((address) =>
      address.length > 254 || !/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(address)))
      return errorResponse("Bitte ein bis drei gültige E-Mail-Adressen durch Semikolon getrennt eingeben.", 400);
    email = { to: recipients, subject: value.subject, text: value.text };
  }
  const versions = body.documents === "client" ? ["client"]
    : body.documents === "document-and-client" ? [body.version, "client"] : [body.version];
  try {
    const response = await fetch(`${(process.env.TEMPLATES_API_URL || "http://localhost:3001").replace(/\/$/, "")}/api/documents${body.action === "mail" ? "/email" : ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.TEMPLATES_API_KEY ? { Authorization: `Bearer ${process.env.TEMPLATES_API_KEY}` } : {}) },
      body: JSON.stringify({ type, id, userGroup: session.userGroup, language: body.language, versions,
        ...(email ? { email } : {}) }),
      cache: "no-store",
      signal: AbortSignal.timeout(90_000),
    });
    const result = await response.json();
    if (!response.ok) return errorResponse(result.error?.message || "Dokumentanfrage fehlgeschlagen.", response.status);
    if (email) {
      const accepted: string[] = Array.isArray(result.email?.accepted)
        ? result.email.accepted.filter((address: unknown): address is string => typeof address === "string") : [];
      const missing = email.to.filter((address) => !accepted.includes(address));
      if (result.email?.status !== "accepted" || missing.length || result.email?.rejected?.length) {
        const details = [
          accepted.length ? `Vom Mailserver angenommen: ${accepted.join("; ")}.` : "Keine Empfänger bestätigt.",
          missing.length ? `Nicht bestätigt: ${missing.join("; ")}.` : "",
        ].filter(Boolean).join(" ");
        return errorResponse(`${details} Bitte vor erneutem Versand den Versandstatus prüfen.`, 502);
      }
    }
    const generated = email ? result.email?.documents : result.documents;
    if (!Array.isArray(generated) || !generated.length || generated.some((item: unknown) =>
      !item || typeof item !== "object" || typeof (item as { filename?: unknown }).filename !== "string"))
      return errorResponse("Die Templates-API hat keine gültigen Dokumentdaten geliefert.", 502);
    let documentWarning: string | undefined;
    try {
      const now = new Date();
      await prisma.ea_documents.createMany({
        data: generated.map((item: { filename: string }) => ({
          order_no: order.order_no,
          doc_date: now,
          customer: order.customer_name?.slice(0, 100),
          doc_type: { costestimate: "Costestimate", invoice: "Invoice", creditnote: "Creditnote" }[type],
          user: session.username.slice(0, 45),
          printed: email ? null : now,
          fork: order.fork_model?.slice(0, 100),
          fork_no: order.fork_no,
          user_group: session.userGroup,
          doc_name: item.filename.slice(0, 45),
          sent_by: email ? "Mail" : "Print",
        })),
      });
    } catch {
      // The PDF/SMTP operation already succeeded; do not invite another send.
      documentWarning = "Der Vorgang war erfolgreich, aber der Eintrag unter Documents konnte nicht gespeichert werden. Bitte nicht erneut versenden.";
    }
    return Response.json({ ...result, ...(documentWarning ? { documentWarning } : {}) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("Die Templates-API ist nicht erreichbar oder hat keine gültige Antwort geliefert. Bei E-Mail bitte vor erneutem Versand den Versandstatus prüfen.", 502);
  }
}
