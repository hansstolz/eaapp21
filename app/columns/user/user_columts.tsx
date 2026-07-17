import { CellContext, ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { EaUser } from "@/app/data_types/user/ea_user";
import Trash from "@/components/app/trash";

export default function UserColumns() {
  const columns = useMemo<ColumnDef<EaUser>[]>(
    () => [
      {
        accessorKey: "user_name",
        header: () => "Username",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "user_rights",
        header: () => "Rights",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "user_group",
        header: () => "User",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },

      {
        accessorKey: "delete",
        header: "",
        size: 20, // feste Breite in Pixel
        minSize: 20,
        maxSize: 40,
        cell: () => {
          return <Trash />;
        },
        meta: {
          isEditable: false,
          align: "right",
          isClickable: true,
        },
      },
    ],
    [],
  );

  return columns;
}
