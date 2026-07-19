import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

export async function GET(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const orderNo = parsePositiveId(new URL(request.url).searchParams.get("order_no"));
  if (!orderNo) return errorResponse("Ungültige Auftragsnummer.", 400);
  const documents = await prisma.ea_documents.findMany({
    where: { order_no: orderNo, user_group: session.userGroup },
    select: {
      uid_document: true, doc_date: true, doc_type: true,
      doc_name: true, sent_by: true,
    },
    orderBy: { doc_date: "desc" },
  });
  return Response.json(documents.map((document) => {
    const parts = document.doc_name?.split("_") ?? [];
    return { ...document, doc_no: `${parts[1] ?? ""} ${parts[2] ?? ""} ` };
  }));
}
