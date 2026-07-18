import { getAuthSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

export async function GET(request: Request) {
  const session = await getAuthSession();
  if (!session) return errorResponse("Nicht authentifiziert.", 401);
  const params = new URL(request.url).searchParams;
  const input = params.get("inp")?.trim() ?? "";
  const type = Number(params.get("type")) || 0;
  if (!input) return Response.json([]);

  if (type === 0) {
    const customers = await prisma.ea_customer.findMany({
      where: {
        user_group: session.userGroup,
        OR: [
          { company: { contains: input } },
          { last_name: { contains: input } },
          { first_name: { contains: input } },
          { street_address: { contains: input } },
          { zip_postal_code: { contains: input } },
          { city: { contains: input } },
        ],
      },
      select: {
        first_name: true, last_name: true, company: true, city: true,
        street_address: true, zip_postal_code: true, customer_no: true, email: true,
      },
      take: 15,
    });
    return Response.json(customers.map(toSearchResult));
  }

  const suppliers = await prisma.ea_companies.findMany({
    where: {
      user_group: session.userGroup,
      OR: [
        { company: { contains: input } },
        { last_name: { contains: input } },
        { first_name: { contains: input } },
        { street_address: { contains: input } },
        { zip_postal_code: { contains: input } },
        { city: { contains: input } },
      ],
    },
    select: {
      first_name: true, last_name: true, company: true, city: true,
      street_address: true, zip_postal_code: true, company_customer_no: true, email: true,
    },
    take: 15,
  });
  return Response.json(
    suppliers.map((supplier) =>
      toSearchResult({
        ...supplier,
        customer_no: Number(supplier.company_customer_no) || null,
      }),
    ),
  );
}

function toSearchResult(item: {
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  city: string | null;
  street_address: string | null;
  zip_postal_code: string | null;
  customer_no: number | null;
  email: string | null;
}) {
  const hasCompany = Boolean(item.company);
  return {
    firstName: hasCompany ? "" : item.first_name,
    lastName: hasCompany ? item.company : item.last_name,
    company: item.company,
    city: item.city,
    streetAddress: item.street_address,
    zipPostalCode: item.zip_postal_code,
    customerNo: item.customer_no,
    email: item.email,
  };
}
