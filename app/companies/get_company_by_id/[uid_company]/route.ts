import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_company: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidCompany = parsePositiveId((await params).uid_company);
  if (!uidCompany) return errorResponse("Ungültige Lieferanten-ID.", 400);
  const company = await prisma.ea_companies.findFirst({
    where: { uid_company: uidCompany, user_group: session.userGroup },
  });
  if (!company) return errorResponse("Lieferant nicht gefunden.", 404);
  const [mails, contacts, purchases] = await Promise.all([
    prisma.ea_mails.findMany({
      where: { uid_company: uidCompany, user_group: session.userGroup },
      orderBy: { mail_date: "desc" },
    }),
    prisma.ea_contacts.findMany({
      where: { uid_company: uidCompany, user_group: session.userGroup },
      orderBy: { last_name: "asc" },
    }),
    prisma.ea_purchases.findMany({
      where: { uid_company: uidCompany, user_group: session.userGroup },
      orderBy: { purchase_date: "desc" },
    }),
  ]);
  return Response.json({ company, mails, contacts, purchases });
}
