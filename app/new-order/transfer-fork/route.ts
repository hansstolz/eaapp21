import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";

export async function GET(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const forkNo = Number(new URL(request.url).searchParams.get("fork_no"));
  if (!Number.isInteger(forkNo) || forkNo <= 0) return errorResponse("Ungültige Gabelnummer.", 400);
  const fork = await prisma.ea_forks.findFirst({
    where: { fork_no: forkNo, user_group: session.userGroup },
    select: { uid_fork: true, fork_no: true, fork_model: true, customer_name: true, customer_no: true, client_name: true, category_fork: true, colour: true, user_group: true },
  });
  return Response.json(fork);
}

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidFork = parsePositiveId(body.uid_fork);
  const uidCustomer = parsePositiveId(body.uid_customer);
  if (!uidFork || !uidCustomer) return errorResponse("Gabel und Kunde sind erforderlich.", 400);
  const [fork, customer] = await Promise.all([
    prisma.ea_forks.findFirst({ where: { uid_fork: uidFork, user_group: session.userGroup } }),
    prisma.ea_customer.findFirst({ where: { uid_customer: uidCustomer, user_group: session.userGroup } }),
  ]);
  if (!fork || !customer) return errorResponse("Gabel oder Kunde nicht gefunden.", 404);
  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.ea_forks.update({
      where: { uid_fork: uidFork },
      data: {
        uid_customer: uidCustomer, customer_no: customer.customer_no,
        customer_name: customer.cal_name_list, customer: customer.cal_address,
        client_name: "", updated_at: new Date(),
      },
    });
    await tx.ea_clients.updateMany({
      where: { uid_fork: uidFork },
      data: { uid_customer: uidCustomer, customer_no: customer.customer_no, last_name: "", updated_at: new Date() },
    });
    return result;
  });
  return Response.json(updated);
}
