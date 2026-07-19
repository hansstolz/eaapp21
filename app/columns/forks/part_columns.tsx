import { EaForksParts } from "@/app/data_types/forks/ea_forks";
import { ColumnDef } from "@tanstack/react-table";

export default function PartsColumns() {
  const columns: ColumnDef<EaForksParts>[] = [
      {
        accessorKey: "forks_part_name",
        header: () => "Partname",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
    ];

  return columns;
}
