import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uid_client: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidClient = parsePositiveId((await params).uid_client);
  if (!uidClient) return errorResponse("Ungültige Client-ID.", 400);
  const client = await prisma.ea_clients.findFirst({
    where: { uid_client: uidClient, user_group: session.userGroup },
  });
  if (!client) return errorResponse("Client nicht gefunden.", 404);
  await prisma.ea_clients.delete({ where: { uid_client: uidClient } });
  return Response.json(client);
}
