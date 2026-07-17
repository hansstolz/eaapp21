import { EaForksParts } from "@/data_types/forks/ea_forks";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Trash from "@/components/general/trash";

export default function ForkPartColumns() {
  const columns = useMemo<ColumnDef<EaForksParts>[]>(
    () => [
      {
        accessorKey: "forks_part_name",
        header: () => "Name",
        size: 70,
      },
      {
        accessorKey: "uid_forks_part",
        header: "",
        size: 20, // feste Breite in Pixel
        minSize: 20,
        maxSize: 40,
        cell: () => {
          return <Trash />;
        },
        meta: {
          align: "right",
          isClickable: true,
        },
      },
    ],
    [],
  );

  return columns;
}
