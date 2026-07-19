import { prisma } from "@/lib/prisma";

export async function findOwnedWarranty(uidWarranty: number, userGroup: string) {
  return prisma.ea_warranty.findFirst({
    where: { uid_warranty: uidWarranty, user_group: userGroup },
  });
}

export async function nextWarrantyNumber(userGroup: string) {
  const sequence = `ea_warranty_${userGroup}`;
  const rows = await prisma.$queryRaw<{ no: bigint | number }[]>`
    SELECT nextval(${sequence}) AS no
  `;
  const value = rows[0]?.no;
  if (value === undefined) throw new Error("Keine Garantienummer verfügbar.");
  return Number(value);
}
