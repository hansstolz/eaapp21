import { EaCustomerOverview } from "@/data_types/customer/ea_customer_overview";
import useGerman from "@/lib/hooks/useGerman";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export default function CustomersOverviewColumns() {
  const { truncate } = useGerman();
  const columns = useMemo<ColumnDef<EaCustomerOverview>[]>(
    () => [
      {
        accessorKey: "customer_no",
        header: () => "No",
        footer: (props) => props.column.id,
        size: 50,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "cal_name_list",
        header: () => "Name",
        cell: (info) => truncate(String(info.getValue() ?? ""), 30),
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
        size: 220,
      },
      {
        accessorKey: "zip_postal_code",
        header: () => "ZIP",
        footer: (props) => props.column.id,
        size: 90,
      },
      {
        accessorKey: "email",
        header: () => "Email",
        cell: (info) => truncate(String(info.getValue() ?? ""), 30),
        footer: (props) => props.column.id,
        size: 220,
      },
      {
        accessorKey: "fon",
        header: () => "Phone",
        cell: (info) => truncate(String(info.getValue() ?? ""), 18),
        footer: (props) => props.column.id,
        size: 120,
      },
      {
        accessorKey: "category_customer",
        header: () => "Catego.",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        size: 70,
      },
    ],
    [truncate],
  );

  return columns;
}
