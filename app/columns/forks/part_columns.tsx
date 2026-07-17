import { EaForksParts } from "@/data_types/forks/ea_forks";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";

export default function PartsColumns() {
  const columns = useMemo<ColumnDef<EaForksParts>[]>(
    () => [
      {
        accessorKey: "forks_part_name",
        header: () => "Partname",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  return columns;
}
