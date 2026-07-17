import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import useGerman from "@/lib/hooks/useGerman";
import { ForkCount } from "@/app/api/sales/sales";

export default function ForksStatColumns() {
  const { toCurrency } = useGerman();

  const columns = useMemo<ColumnDef<ForkCount>[]>(
    () => [
      {
        accessorKey: "count",
        header: () => "Count",
        footer: (props) => props.column.id,
        size: 80,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "fork_model",
        header: () => "Fork Model",
        footer: (props) => props.column.id,
      },

      {
        accessorKey: "countInvoice",
        header: () => "Invoce",
        footer: (props) => props.column.id,
        size: 80,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "countWarranty",
        header: () => "Warranty",
        footer: (props) => props.column.id,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "countWI",
        header: () => "W+I",
        footer: (props) => props.column.id,
        size: 80,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "dealerPrivate",
        header: () => "Dealer+Private",
        cell: (info) => toCurrency(info.getValue() as number),
        footer: (props) => props.column.id,
        size: 100,
        meta: {
          align: "right",
          isEditable: false,
        },
      },

      {
        accessorKey: "warranty",
        header: () => "Warranty",
        cell: (info) => toCurrency(info.getValue() as number),
        footer: (props) => props.column.id,
        size: 100,
        meta: {
          align: "right",
          isEditable: false,
        },
      },

      {
        accessorKey: "revenue",
        header: () => "Sum",
        cell: (info) => toCurrency(info.getValue() as number),
        footer: (props) => props.column.id,
        size: 100,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
    ],
    [],
  );

  return columns;
}
