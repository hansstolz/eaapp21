import { EaCompanyOverview } from "@/app/api/companies/companies_crud";
import useGerman from "@/lib/hooks/useGerman";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export default function SuppliersOverviewColumns() {
  const { truncate } = useGerman();
  const columns = useMemo<ColumnDef<EaCompanyOverview>[]>(
    () => [
      {
        accessorKey: "company_customer_no",
        header: () => "No",
        cell: (info) => truncate(String(info.getValue() ?? ""), 20),
        footer: (props) => props.column.id,
        size: 140,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "company",
        header: () => "Company",
        cell: (info) => truncate(String(info.getValue() ?? ""), 80),
        footer: (props) => props.column.id,
        size: 200,
      },
      {
        accessorKey: "city",
        header: () => "City",
        cell: (info) => truncate(String(info.getValue() ?? ""), 60),
        footer: (props) => props.column.id,
        size: 140,
      },
      {
        accessorKey: "street_address",
        header: () => "Street",
        cell: (info) => truncate(String(info.getValue() ?? ""), 80),
        footer: (props) => props.column.id,
        size: 160,
      },
      {
        accessorKey: "zip_postal_code",
        header: () => "ZIP",
        footer: (props) => props.column.id,
        size: 100,
      },
      {
        accessorKey: "email",
        header: () => "Email",
        cell: (info) => truncate(String(info.getValue() ?? ""), 80),
        footer: (props) => props.column.id,
        size: 220,
      },
    ],
    [truncate],
  );

  return columns;
}
