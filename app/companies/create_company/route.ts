import type { ea_companiesCreateInput } from "@/generated/prisma/models/ea_companies";
import { calculatedCompanyFields, COMPANY_FIELDS } from "@/lib/company-fields";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Lieferantendaten.", 400);
  const data = pickDefinedFields<ea_companiesCreateInput>(body, COMPANY_FIELDS);
  Object.assign(data, calculatedCompanyFields(body));
  data.user_group = session.userGroup;
  const company = await prisma.ea_companies.create({
    data: data as ea_companiesCreateInput,
  });
  return Response.json(company, { status: 201 });
}
