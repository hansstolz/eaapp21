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
  if (!uidCompany) return errorResponse("Ungültige Firmen-ID.", 400);
  const mails = await prisma.ea_mails.findMany({
    where: { uid_company: uidCompany, user_group: session.userGroup },
    orderBy: { mail_date: "desc" },
  });
  return Response.json(mails);
}
