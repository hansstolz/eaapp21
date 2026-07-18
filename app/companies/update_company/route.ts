import type { ea_companiesUpdateInput } from "@/generated/prisma/models/ea_companies";
import { calculatedCompanyFields, COMPANY_FIELDS } from "@/lib/company-fields";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Lieferantendaten.", 400);
  const uidCompany = parsePositiveId(body.uid_company);
  if (!uidCompany) return errorResponse("Ungültige Lieferanten-ID.", 400);
  const existing = await prisma.ea_companies.findFirst({
    where: { uid_company: uidCompany, user_group: session.userGroup },
    select: { uid_company: true },
  });
  if (!existing) return errorResponse("Lieferant nicht gefunden.", 404);
  const data = pickDefinedFields<ea_companiesUpdateInput>(body, COMPANY_FIELDS);
  Object.assign(data, calculatedCompanyFields(body));
  data.user_group = session.userGroup;
  const company = await prisma.ea_companies.update({
    where: { uid_company: uidCompany },
    data,
  });
  return Response.json(company);
}
