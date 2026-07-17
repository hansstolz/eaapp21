import { CellContext, ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { EaValues } from "@/data_types/user/ea_values";
import { Trash2 } from "lucide-react";
import Trash from "@/components/general/trash";

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
