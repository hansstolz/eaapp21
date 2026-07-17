import { EaPurchases } from "@/data_types/purachases/ea_purchases";
import useGerman from "@/lib/hooks/useGerman";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";

export default function PurchasesColumns() {
  const { to2DigitDateFromString } = useGerman();
  const columns = useMemo<ColumnDef<EaPurchases>[]>(
    () => [
      {
        accessorKey: "purchase_no",
        header: () => "PurNo",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "purchase_date",
        header: () => "Date",
        cell: (info) => to2DigitDateFromString(info.getValue() as string),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "company_name",
        header: () => "Contact",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  return columns;
}
