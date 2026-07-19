import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_fork: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidFork = parsePositiveId((await params).uid_fork);
  if (!uidFork) return errorResponse("Ungültige Fork-ID.", 400);
  const fork = await prisma.ea_forks.findFirst({
    where: { uid_fork: uidFork, user_group: session.userGroup },
    select: { uid_fork: true },
  });
  if (!fork) return errorResponse("Fork nicht gefunden.", 404);
  const history = await prisma.ea_orders.findMany({
    where: { uid_fork: uidFork, user_group: session.userGroup },
    select: {
      created_at: true, customer_no: true, customer_name: true,
      customer_client_name: true, fork_in_date: true,
    },
    orderBy: { created_at: "desc" },
  });
  return Response.json(history);
}
