import { EaClients } from "@/app/data_types/clients/ea_clients";
import Trash from "@/components/app/trash";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";

export default function ClientColumns() {
  const columns = useMemo<ColumnDef<EaClients>[]>(
    () => [
      {
        accessorKey: "last_name",
        header: () => "Last Name",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "first_name",
        header: () => "First Name",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },

      {
        accessorKey: "city",
        header: () => "City",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "phone",
        header: () => "Phone",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        meta: {
          align: "left",
          width: "100px",
        },
      },
      {
        accessorKey: "fork_model",
        header: () => "Fork",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        meta: {
          align: "left",
          width: "100px",
        },
      },
      {
        accessorKey: "fork_no",
        header: () => "ForkNo",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        meta: {
          align: "right",
          width: "100px",
        },
      },
      {
        accessorKey: "uid_client",
        header: () => "Delete",
        footer: (props) => props.column.id,
        cell: (info) => <Trash />,
        size: 40,
        meta: {
          align: "right",
          isClickable: true,
          showTooltip: false,
        },
      },
    ],
    [],
  );

  return columns;
}
