import { RefForks } from "@/app/api/sales/sales";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
type Props = {
  header: string;
};

export default function RefsStatColumns({ header }: Props) {
  const columns = useMemo<ColumnDef<RefForks>[]>(
    () => [
      {
        accessorKey: "reffork",
        header: header,

        footer: (props) => props.column.id,
      },

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
    ],
    [],
  );

  return columns;
}
