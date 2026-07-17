import { EaValues } from "@/app/data_types/user/ea_values";
import Trash from "@/components/app/trash";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";

export default function ValueColumns() {
  const columns = useMemo<ColumnDef<EaValues>[]>(
    () => [
      {
        accessorKey: "value",
        cell: (info) => info.getValue(),
        header: () => "Value",
        meta: {
          isEditable: false,
          align: "left",
          isClickable: false,
        },
      },
      {
        accessorKey: "value_two",
        cell: (info) => info.getValue(),
        header: () => "Value",
        meta: {
          isEditable: false,
          align: "left",
          isClickable: false,
        },
      },
      {
        accessorKey: "user_group",
        cell: (info) => info.getValue(),
        header: () => "User",
        meta: {
          isEditable: false,
          align: "left",
          isClickable: false,
        },
      },

      {
        accessorKey: "uid_value",
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
