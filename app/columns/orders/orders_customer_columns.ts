import { EaOrdersCustomer } from "@/data_types/orders/ea_orders_customer";
import useGerman from "@/lib/hooks/useGerman";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";

export default function CustomerOrdersColumns() {
  const { to2DigitDateFromString } = useGerman();
  const columns = useMemo<ColumnDef<EaOrdersCustomer>[]>(
    () => [
      {
        accessorKey: "invoice_date",
        header: () => "Date",
        cell: (info) => to2DigitDateFromString(info.getValue() as string),
        footer: (props) => props.column.id,
        meta: {
          align: "left",
          width: "80px",
        },
      },
      {
        accessorKey: "order_no",
        header: () => "OrderNo",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        meta: {
          align: "left",
          width: "80px",
        },
      },

      {
        accessorKey: "fork_no",
        header: () => "ForkNo",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        meta: {
          align: "left",
          width: "80px",
        },
      },
      {
        accessorKey: "fork_model",
        header: () => "Fork Model",
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  return columns;
}
