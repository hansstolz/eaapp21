import { TForkOrder } from "@/data_types/forks/ea_forks";
import useGerman from "@/lib/hooks/useGerman";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";

export default function ForkOrdersColumns() {
  const { to2DigitDateFromString } = useGerman();
  const columns = useMemo<ColumnDef<TForkOrder>[]>(
    () => [
      {
        accessorKey: "invoice_date",
        header: () => "Date",
        cell: (info) => to2DigitDateFromString(info.getValue() as string),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "customer_no",
        header: () => "Cust No",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        size: 80,
      },
      {
        accessorKey: "customer_name",
        header: () => "Customer Name",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "customer_client_name",
        header: () => "Client Name",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "fork_in_date",
        header: () => "Fork In",
        cell: (info) => to2DigitDateFromString(info.getValue() as string),
        footer: (props) => props.column.id,
        size: 80,
      },
    ],
    [],
  );

  return columns;
}
