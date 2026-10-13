import type { Prisma } from "@/generated/prisma/client";

export async function nextCostestimateNumber(tx: Prisma.TransactionClient, userGroup: string): Promise<number> {
  return reserveNumber(tx, `ea_orders_costestimates_${userGroup}`, "Costestimate");
}

export async function nextOrderNumber(tx: Prisma.TransactionClient, userGroup: string): Promise<number> {
  return reserveNumber(tx, `ea_orders_${userGroup}`, "Auftrag");
}

async function reserveNumber(tx: Prisma.TransactionClient, sequenceName: string, label: string): Promise<number> {
  // MyISAM does not roll back: reserve the current number in one atomic update.
  // Read it on the same transaction connection before any INSERT changes it.
  const changed = await tx.$executeRaw`
    UPDATE sequence.sequence_data
    SET sequence_cur_value = LAST_INSERT_ID(sequence_cur_value) + sequence_increment
    WHERE sequence_name = ${sequenceName}
      AND sequence_increment > 0
      AND sequence_cur_value >= GREATEST(sequence_min_value, 1)
      AND sequence_cur_value <= 2147483647
      AND sequence_cur_value + sequence_increment <= sequence_max_value
  `;
  if (changed !== 1) throw new Error(`Keine ${label}-Nummer verfügbar: Sequenz fehlt oder ist ausgeschöpft.`);
  const rows = await tx.$queryRaw<{ no: bigint | number }[]>`SELECT LAST_INSERT_ID() AS no`;
  const number = Number(rows[0]?.no);
  if (!Number.isSafeInteger(number) || number <= 0 || number > 2147483647)
    throw new Error(`Die ${label}-Sequenz hat eine ungültige Nummer geliefert.`);
  return number;
}
