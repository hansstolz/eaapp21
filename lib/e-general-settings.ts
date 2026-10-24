import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { eGeneralSchema, type EGeneralSettings, type EGeneralValues } from "@/app/schemas/general/e-general-schema";

// ef is a separate database on the same server as the application's database.
// Only validated, editable columns are used in UPDATE statements; generated
// columns and automatic timestamps are always managed by MySQL.
const editableFields = Object.keys(eGeneralSchema.shape).filter(
  (field): field is Exclude<keyof EGeneralValues, "uid_esettings"> => field !== "uid_esettings",
);
type SettingsRow = Record<string, unknown> & {
  uid_esettings: number | bigint;
  invoiceDateIsDeliveryDate: number | bigint | boolean;
  date_created: Date;
  date_updated: Date;
};
function serialize(row: SettingsRow): EGeneralSettings {
  const values: Record<string, unknown> = {};
  for (const field of editableFields) values[field] = row[field] ?? "";
  return {
    ...eGeneralSchema.parse({ ...values, uid_esettings: Number(row.uid_esettings), invoiceDateIsDeliveryDate: Boolean(row.invoiceDateIsDeliveryDate) }),
    user_group: String(row.user_group ?? ""),
    date_created: row.date_created.toISOString(),
    date_updated: row.date_updated.toISOString(),
    sender: String(row.sender ?? ""),
    address_warranty: String(row.address_warranty ?? ""),
    footer_lists: String(row.footer_lists ?? ""),
    footer_mails: String(row.footer_mails ?? ""),
  };
}
export async function readEGeneralSettings(userGroup: string) {
  const rows = await prisma.$queryRaw<SettingsRow[]>`
    SELECT * FROM ef.ea_esettings WHERE user_group = ${userGroup} ORDER BY uid_esettings ASC
  `;
  return rows.map(serialize);
}
export async function updateEGeneralSettings(userGroup: string, values: EGeneralValues) {
  return prisma.$transaction(async tx => {
    const rows = await tx.$queryRaw<SettingsRow[]>`
      SELECT * FROM ef.ea_esettings
      WHERE uid_esettings = ${values.uid_esettings} AND user_group = ${userGroup} FOR UPDATE
    `;
    if (!rows.length) return null;
    const assignments = editableFields.map(field =>
      Prisma.sql`${Prisma.raw(`\`${field}\``)} = ${values[field]}`,
    );
    await tx.$executeRaw(Prisma.sql`
      UPDATE ef.ea_esettings SET ${Prisma.join(assignments)}
      WHERE uid_esettings = ${values.uid_esettings} AND user_group = ${userGroup}
    `);
    const updated = await tx.$queryRaw<SettingsRow[]>`
      SELECT * FROM ef.ea_esettings
      WHERE uid_esettings = ${values.uid_esettings} AND user_group = ${userGroup}
    `;
    return serialize(updated[0]);
  });
}
