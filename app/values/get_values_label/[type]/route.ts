import type { DropdownItem } from "@/app/data_types/general/dropdown";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/route-utils";

type ValueSource = {
  table: string;
  idColumn: string;
  labelColumn: string;
};

type RawDropdownItem = {
  uid: bigint | number;
  label: string;
  value: string;
};

const VALUE_SOURCES: Readonly<Record<string, ValueSource>> = {
  ea_articles_category: {
    table: "ea_articles_category",
    idColumn: "uid_articles_category",
    labelColumn: "articles_category",
  },
  ea_compr_in: {
    table: "ea_compr_in",
    idColumn: "uid_compr_in",
    labelColumn: "value_compr_in",
  },
  ea_compr_out: {
    table: "ea_compr_out",
    idColumn: "uid_compr_out",
    labelColumn: "value_compr_out",
  },
  ea_customer_payment: {
    table: "ea_customer_payment",
    idColumn: "uid_customer_payment",
    labelColumn: "customer_payment_value",
  },
  ea_forks_category: {
    table: "ea_forks_category",
    idColumn: "uid_forks_category",
    labelColumn: "category",
  },
  ea_forks_color: {
    table: "ea_forks_color",
    idColumn: "uid_forks_color",
    labelColumn: "forks_color_value",
  },
  ea_forks_settings: {
    table: "ea_forks_settings",
    idColumn: "uid_forks_setting",
    labelColumn: "forks_setting_text",
  },
  ea_forks_use: {
    table: "ea_forks_use",
    idColumn: "uid_forks_use",
    labelColumn: "forks_use_text",
  },
  ea_rebound_in: {
    table: "ea_rebound_in",
    idColumn: "uid_rebound_in",
    labelColumn: "value_rebound_in",
  },
  ea_rebound_out: {
    table: "ea_rebound_out",
    idColumn: "uid_rebound_out",
    labelColumn: "value_rebound_out",
  },
  ea_ref_forks_parts: {
    table: "ea_ref_forks_parts",
    idColumn: "uid_ref_forks_part",
    labelColumn: "ref_forks_part_name",
  },
  ea_value_air: {
    table: "ea_value_air",
    idColumn: "uid_value_air",
    labelColumn: "value_air",
  },
  ea_value_ap: {
    table: "ea_value_ap",
    idColumn: "uid_value_ap",
    labelColumn: "value_ap",
  },
  ea_value_car: {
    table: "ea_value_car",
    idColumn: "uid_value_car",
    labelColumn: "value_car",
  },
  ea_value_cs: {
    table: "ea_value_cs",
    idColumn: "uid_value_cs",
    labelColumn: "value_cs",
  },
  ea_value_di: {
    table: "ea_value_di",
    idColumn: "uid_value_di",
    labelColumn: "value_di",
  },
  ea_value_hs: {
    table: "ea_value_hs",
    idColumn: "uid_value_hs",
    labelColumn: "value_hs",
  },
  ea_value_ns: {
    table: "ea_value_ns",
    idColumn: "uid_value_ns",
    labelColumn: "value_ns",
  },
  ea_value_ov: {
    table: "ea_value_ov",
    idColumn: "uid_value_ov",
    labelColumn: "value_ov",
  },
  ea_value_sb: {
    table: "ea_value_sb",
    idColumn: "uid_value_sb",
    labelColumn: "value_sb",
  },
  ea_value_tax: {
    table: "ea_value_tax",
    idColumn: "uid_value_tax",
    labelColumn: "value_tax",
  },
  ea_value_ts: {
    table: "ea_value_ts",
    idColumn: "uid_value_ts",
    labelColumn: "value_ts",
  },
  ea_value_ws: {
    table: "ea_value_ws",
    idColumn: "uid_value_ws",
    labelColumn: "value_ws",
  },
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const type = decodeURIComponent((await params).type);
  const source = VALUE_SOURCES[type];

  if (!source) return errorResponse("Unbekannter Wertetyp.", 400);

  // Alle SQL-Bezeichner stammen ausschließlich aus der festen Allowlist oben.
  const rows = await prisma.$queryRawUnsafe<RawDropdownItem[]>(
    `SELECT \`${source.idColumn}\` AS uid, CAST(\`${source.labelColumn}\` AS CHAR) AS label, CAST(\`${source.labelColumn}\` AS CHAR) AS value
     FROM \`${source.table}\`
     WHERE \`${source.labelColumn}\` IS NOT NULL
       AND TRIM(CAST(\`${source.labelColumn}\` AS CHAR)) <> ''
     ORDER BY \`${source.labelColumn}\` ASC`,
  );
  const values: DropdownItem[] = rows.map((row) => ({
    uid: Number(row.uid),
    label: row.label,
    value: row.value,
  }));

  return Response.json(values);
}
