import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";

type OrderItem = { uid_text?: unknown; text_no?: unknown };

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Ungültiger JSON-Body.", 400);
  }
  if (!Array.isArray(body)) return errorResponse("Ein Array wird erwartet.", 400);

  const updates = (body as OrderItem[]).map((item) => ({
    uid: parsePositiveId(item.uid_text),
    textNo: Number(item.text_no),
  }));
  if (
    updates.some(
      (item) => !item.uid || !Number.isInteger(item.textNo) || item.textNo < 0,
    )
  ) {
    return errorResponse("Ungültige Sortierreihenfolge.", 400);
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of updates) {
        const result = await tx.ea_texts.updateMany({
          where: {
            uid_text: item.uid as number,
            user_group: session.userGroup,
          },
          data: { text_no: item.textNo },
        });
        if (result.count !== 1) throw new Error("TEXT_NOT_FOUND");
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TEXT_NOT_FOUND") {
      return errorResponse("Mindestens ein Text wurde nicht gefunden.", 404);
    }
    throw error;
  }

  return new Response(null, { status: 204 });
}
