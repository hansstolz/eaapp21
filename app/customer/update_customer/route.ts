import type { ea_customerUpdateInput } from "@/generated/prisma/models/ea_customer";
import { calculatedCustomerFields, CUSTOMER_FIELDS, mailParts } from "@/lib/customer-fields";
import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse, parsePositiveId, pickDefinedFields, readJsonObject } from "@/lib/route-utils";
import { customerCountrySchema, customerExemptionSchema } from "@/app/schemas/customer/customer_schema";

export async function PUT(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const body = await readJsonObject(request);
  if (!body) return errorResponse("Ungültige Kundendaten.", 400);
  const country = customerCountrySchema.safeParse(body.country);
  if (!country.success) return errorResponse("Country is required.", 400);
  const exemption = customerExemptionSchema.safeParse(body);
  if (!exemption.success) return errorResponse(exemption.error.issues[0]?.message ?? "Ungültige Steuerbefreiung.", 400);
  const uidCustomer = parsePositiveId(body.uid_customer);
  if (!uidCustomer) return errorResponse("Ungültige Kunden-ID.", 400);
  const uidOrder = body.uid_order === undefined ? null : parsePositiveId(body.uid_order);
  if (body.uid_order !== undefined && !uidOrder)
    return errorResponse("Ungültige Auftrags-ID.", 400);
  const existing = await prisma.ea_customer.findFirst({
    where: { uid_customer: uidCustomer, user_group: session.userGroup },
    select: { uid_customer: true },
  });
  if (!existing) return errorResponse("Kunde nicht gefunden.", 404);
  const data = pickDefinedFields<ea_customerUpdateInput>(body, CUSTOMER_FIELDS);
  Object.assign(data, calculatedCustomerFields(body));
  data.user_group = session.userGroup;
  const customer = await prisma.$transaction(async (tx) => {
    if (uidOrder) {
      const order = await tx.ea_orders.findFirst({
        where: { uid_order: uidOrder, uid_customer: uidCustomer, user_group: session.userGroup },
        select: { uid_order: true },
      });
      if (!order) return null;
    }
    const customer = await tx.ea_customer.update({
      where: { uid_customer: uidCustomer },
      data: { ...data, updated_at: new Date() },
    });
    if (uidOrder) {
      await tx.ea_orders.update({
        where: { uid_order: uidOrder },
        data: {
          customer_no: customer.customer_no,
          customer_name: customer.cal_name_list,
          customer_address: customer.cal_address,
          customer_address_alt: customer.delivery_address,
          customer_fon: customer.fon,
          customer_email: customer.email,
          customer_category_no: customer.customer_category_no,
          bank_name: customer.bank_name,
          bank_id: customer.bank_id,
          bank_account: customer.bank_account,
          bank_payment: customer.bank_payment,
          vat_no_customer: customer.vat_no,
          no_vat: customer.no_vat,
          updated_at: new Date(),
        },
      });
    }
    return customer;
  });
  if (!customer) return errorResponse("Auftrag oder Kundenzuordnung nicht gefunden.", 404);
  return Response.json({ ...customer, ...mailParts(customer.email) });
}
