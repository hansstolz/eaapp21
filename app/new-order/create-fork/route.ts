import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, readJsonObject } from "@/lib/route-utils";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Daten.", 400);
  const uidCustomer = parsePositiveId(body.uid_customer);
  const uidRefFork = parsePositiveId(body.uid_ref_fork);
  if (!uidCustomer || !uidRefFork) return errorResponse("Kunde und Referenzgabel sind erforderlich.", 400);
  const customer = await prisma.ea_customer.findFirst({ where: { uid_customer: uidCustomer, user_group: session.userGroup } });
  if (!customer) return errorResponse("Kunde nicht gefunden.", 404);
  const refFork = await prisma.ea_ref_forks.findUnique({ where: { uid_ref_fork: uidRefFork } });
  if (!refFork) return errorResponse("Referenzgabel nicht gefunden.", 404);
  const maxFork = await prisma.ea_forks.aggregate({ where: { user_group: session.userGroup }, _max: { fork_no: true } });
  const forkNo = (maxFork._max.fork_no ?? 0) + 1;
  const now = new Date();
  const fork = await prisma.$transaction(async (tx) => {
    const created = await tx.ea_forks.create({ data: {
      fork_no: forkNo,
      fork_model: typeof body.fork_model === "string" && body.fork_model ? body.fork_model : refFork.fork_model,
      category_fork: typeof body.category_fork === "string" ? body.category_fork : "",
      colour: typeof body.colour === "string" ? body.colour : "",
      wheelsize: typeof body.wheelsize === "string" ? body.wheelsize : "",
      client_name: typeof body.client_name === "string" ? body.client_name : "",
      customer: customer.cal_address,
      customer_name: customer.cal_name_list,
      customer_no: customer.customer_no,
      uid_customer: customer.uid_customer,
      uid_ref_fork: uidRefFork,
      uid_client: 0,
      user_group: session.userGroup,
      created_at: now, updated_at: now,
    } });
    const client = await tx.ea_clients.create({ data: {
      last_name: created.client_name,
      fork_no: created.fork_no,
      customer_no: customer.customer_no,
      user_group: session.userGroup,
      uid_fork: created.uid_fork,
      uid_customer: customer.uid_customer,
      created_at: now, updated_at: now,
    } });
    return tx.ea_forks.update({ where: { uid_fork: created.uid_fork }, data: { uid_client: client.uid_client } });
  });
  return Response.json(fork, { status: 201 });
}
