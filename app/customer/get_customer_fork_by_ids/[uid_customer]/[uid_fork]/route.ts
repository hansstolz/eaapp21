import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uid_customer: string; uid_fork: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const values = await params;
  const uidCustomer = parsePositiveId(values.uid_customer);
  const uidFork = parsePositiveId(values.uid_fork);
  if (!uidCustomer || !uidFork) return errorResponse("Ungültige IDs.", 400);
  const [customer, fork, clients] = await Promise.all([
    prisma.ea_customer.findFirst({
      where: { uid_customer: uidCustomer, user_group: session.userGroup },
      select: { first_name: true, last_name: true, company: true, cal_address: true },
    }),
    prisma.ea_forks.findFirst({
      where: { uid_fork: uidFork, user_group: session.userGroup },
      select: { client_name: true },
    }),
    prisma.ea_clients.findMany({
      where: { uid_customer: uidCustomer, user_group: session.userGroup },
    }),
  ]);
  if (!customer) return Response.json(null);
  return Response.json({
    ...customer,
    clients,
    client_name: fork?.client_name ?? "",
  });
}
