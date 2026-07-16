import Trash from "@/components/general/trash";
import { ForkFeature } from "@/data_types/ref_forks/ref_forks";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export default function RefFeaturesColumns() {
  const columns = useMemo<ColumnDef<ForkFeature>[]>(
    () => [
      {
        accessorKey: "ref_part_name",
        header: () => "RefPartName",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "ref_part_qualitiy",
        header: () => "RefPartQuality",
        footer: (props) => props.column.id,
      },

      {
        accessorKey: "check_character_int",
        header: () => "",
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
