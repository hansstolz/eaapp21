import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function findOwnedWarranty(uidWarranty: number, userGroup: string) {
  return prisma.ea_warranty.findFirst({
    where: { uid_warranty: uidWarranty, user_group: userGroup },
  });
}

export async function nextWarrantyNumber(userGroup: string, tx?: Prisma.TransactionClient): Promise<number> {
  if (!tx) return prisma.$transaction((client) => nextWarrantyNumber(userGroup, client));
  const sequence = `ea_warranty_${userGroup}`;
  // Reserve the current value atomically, even though sequence_data uses MyISAM.
  const changed = await tx.$executeRaw`
    UPDATE sequence.sequence_data
    SET sequence_cur_value = CASE
      WHEN LAST_INSERT_ID(sequence_cur_value) + sequence_increment > sequence_max_value
      THEN sequence_min_value
      ELSE sequence_cur_value + sequence_increment
    END
    WHERE sequence_name = ${sequence}
      AND (sequence_cur_value + sequence_increment <= sequence_max_value OR sequence_cycle = 1)
  `;
  if (changed !== 1) throw new Error("Keine Garantienummer verfügbar.");
  const rows = await tx.$queryRaw<{ no: bigint | number }[]>`
    SELECT LAST_INSERT_ID() AS no
  `;
  const value = rows[0]?.no;
  if (value === undefined || !Number.isSafeInteger(Number(value)) || Number(value) <= 0)
    throw new Error("Keine Garantienummer verfügbar.");
  return Number(value);
}
