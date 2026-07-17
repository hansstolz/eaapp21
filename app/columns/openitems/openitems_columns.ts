import { OpenItem } from "@/app/api/sales/sales";
import useGerman from "@/lib/hooks/useGerman";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";

export default function OpenItemsColumns() {
  const { toCurrency, to2DigitDateFromString } = useGerman();

  const columns = useMemo<ColumnDef<OpenItem>[]>(
    () => [
      {
        accessorKey: "invoiceDate",
        header: () => "Date",
        footer: (props) => props.column.id,
        cell: (info) => to2DigitDateFromString(info.getValue() as string),
        size: 80,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "invoiceNo",
        header: () => "InNo",
        footer: (props) => props.column.id,
        size: 90,
        meta: {
          align: "right",
          isEditable: false,
        },
      },

      {
        accessorKey: "customerAddress",
        header: () => "Customer",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "customerNo",
        header: () => "Cust No",
        footer: (props) => props.column.id,
        size: 80,
        meta: {
          align: "right",
          isEditable: false,
        },
      },

      {
        accessorKey: "calAmountPrice",
        header: () => "Sum",
        cell: (info) => toCurrency(info.getValue() as number),
        footer: (props) => props.column.id,
        size: 100,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "calOutstandingMoney",
        header: () => "Open",
        cell: (info) => toCurrency(info.getValue() as number),
        footer: (props) => props.column.id,
        size: 100,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "days",
        header: () => "Days",
        footer: (props) => props.column.id,
        size: 80,
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
