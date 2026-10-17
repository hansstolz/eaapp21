import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  const invoiceNo = parsePositiveId(body?.warranty_invoice_no);
  if (!invoiceNo || !Number.isSafeInteger(invoiceNo) || invoiceNo > 2147483647)
    return errorResponse("Ungültige Rechnungsnummer.", 400);
  const invoice = await prisma.ea_warranty_invoices.findFirst({
    where: { warranty_invoice_no: invoiceNo, user_group: session.userGroup },
    select: { uid_warranty_invoice: true },
  });
  if (!invoice) return errorResponse("Gewährleistungsrechnung nicht gefunden.", 404);
  try {
    const response = await fetch(`${(process.env.TEMPLATES_API_URL || "http://localhost:3001").replace(/\/$/, "")}/api/documents/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.TEMPLATES_API_KEY ? { Authorization: `Bearer ${process.env.TEMPLATES_API_KEY}` } : {}) },
      body: JSON.stringify({ type: "warranties", user_group: session.userGroup, warranty_invoice_no: invoiceNo, language: "german", variant: "standard" }),
      cache: "no-store", signal: AbortSignal.timeout(90_000),
    });
    if (!response.ok) {
      const result = await response.json();
      return errorResponse(result.error?.message || "Rechnung konnte nicht erzeugt werden.", response.status);
    }
    if (!response.headers.get("content-type")?.includes("application/pdf"))
      return errorResponse("Die Templates-API hat kein PDF geliefert.", 502);
    return new Response(await response.arrayBuffer(), { headers: {
      "Content-Type": "application/pdf", "Cache-Control": "no-store",
      "Content-Disposition": `inline; filename="${invoiceNo}_warranties.pdf"`,
    } });
  } catch {
    return errorResponse("Die Templates-API ist nicht erreichbar oder hat keine gültige Antwort geliefert.", 502);
  }
}
