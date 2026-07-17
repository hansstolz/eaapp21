import Trash from "@/components/general/trash";
import { EaFormOverview } from "@/data_types/forms/ea_forms";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

export default function FormColumns() {
  const columns: ColumnDef<EaFormOverview>[] = [
    {
      accessorKey: "user_print_language",
      header: "Print Language",
      meta: {
        isEditable: false,
        align: "left",
        isClickable: false,
      },
    },
    {
      accessorKey: "user_group",
      header: "User Group",
      meta: {
        isEditable: false,
        align: "left",
        isClickable: false,
      },
    },

    {
      accessorKey: "delete",
      header: "",
      cell: () => {
        return <Trash />;
      },
      meta: {
        isEditable: false,
        align: "right",
        isClickable: true,
      },
    },
  ];

  return { columns };
}
