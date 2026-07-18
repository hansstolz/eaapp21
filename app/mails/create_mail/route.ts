import type { Prisma } from "@/generated/prisma/client";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, pickDefinedFields, readJsonObject } from "@/lib/route-utils";

const fields = [
  "mail_date", "subject", "customer", "subject_yes_no", "company",
  "message_text", "sender", "mail_no", "email_address", "company_no",
  "customer_no", "address", "mail_status", "sender_email_address",
  "uid_company", "uid_customer",
] as const satisfies readonly (keyof Prisma.ea_mailsUncheckedCreateInput)[];

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Mail-Daten.", 400);
  const data = pickDefinedFields<Prisma.ea_mailsUncheckedCreateInput>(body, fields);
  data.user_group = session.userGroup;
  if (typeof data.mail_date === "string") {
    const date = new Date(data.mail_date);
    if (Number.isNaN(date.getTime())) return errorResponse("Ungültiges Mail-Datum.", 400);
    data.mail_date = date;
  }
  data.uid_company = Number(data.uid_company) || 0;
  data.uid_customer = Number(data.uid_customer) || 0;
  const mail = await prisma.ea_mails.create({
    data: data as Prisma.ea_mailsUncheckedCreateInput,
  });
  return Response.json(mail, { status: 201 });
}
