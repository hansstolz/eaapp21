import { getAuthSession } from "@/lib/auth-session";
import { errorResponse, parsePositiveId } from "@/lib/route-utils";
import { findOwnedWarranty } from "@/lib/warranty-detail";
import { PUT as updateWarrantyStatus } from "@/app/orders/update_warranty_status/[uid_order]/route";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ uid_warranty: string }> },
) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const uidWarranty = parsePositiveId((await params).uid_warranty);
  if (!uidWarranty) return errorResponse("Ungültige Warranty-ID.", 400);
  const existing = await findOwnedWarranty(uidWarranty, session.userGroup);
  if (!existing)
    return errorResponse("Warranty nicht gefunden.", 404);
  return updateWarrantyStatus(new Request(_request.url, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "accept" }),
  }), { params: Promise.resolve({ uid_order: String(existing.uid_order) }) });
}
