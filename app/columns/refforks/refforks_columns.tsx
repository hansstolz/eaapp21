import { EaRefForks } from "@/app/data_types/ref_forks/ref_forks";
import Trash from "@/components/app/trash";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";

export default function useRefColumns() {
  const columns = useMemo<ColumnDef<EaRefForks>[]>(
    () => [
      {
        accessorKey: "category_fork",
        header: () => "Category",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "fork_model",
        header: () => "Fork Model",
        footer: (props) => props.column.id,
      },

      {
        accessorKey: "uid_ref_fork",
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
