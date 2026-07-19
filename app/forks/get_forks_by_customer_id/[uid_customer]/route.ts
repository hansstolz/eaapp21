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
  const forks = await prisma.ea_forks.findMany({
    where: { uid_customer: uidCustomer, user_group: session.userGroup },
    select: {
      uid_fork: true, fork_no: true, fork_model: true, colour: true,
      customer_name: true, customer_no: true, client_name: true,
      category_fork: true, user_group: true,
    },
    orderBy: { fork_no: "desc" },
  });
  return Response.json(forks);
}
