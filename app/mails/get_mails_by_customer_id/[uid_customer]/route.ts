import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_customer: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidCustomer = parsePositiveId((await params).uid_customer);
  if (!uidCustomer) return errorResponse("Ungültige Kunden-ID.", 400);
  const mails = await prisma.ea_mails.findMany({
    where: { uid_customer: uidCustomer, user_group: session.userGroup },
    orderBy: { mail_date: "desc" },
  });
  return Response.json(mails);
}
