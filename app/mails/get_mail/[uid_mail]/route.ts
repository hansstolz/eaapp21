import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_mail: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidMail = parsePositiveId((await params).uid_mail);
  if (!uidMail) return errorResponse("Ungültige Mail-ID.", 400);

  const mail = await prisma.ea_mails.findFirst({
    where: { uid_mail: uidMail, user_group: session.userGroup },
  });
  if (!mail) return errorResponse("Mail nicht gefunden.", 404);
  return Response.json(mail);
}
