import { EaForkHistory } from "@/app/data_types/forks/ea_fork_history";
import { ColumnDef } from "@tanstack/react-table";

const toGermanDate = (isoString: string) =>
  new Date(isoString).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

export default function ForkHistCol() {
  const columns: ColumnDef<EaForkHistory>[] = [
      {
        accessorKey: "created_at",
        header: () => "Date",
        cell: (info) => toGermanDate(info.getValue() as string),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "customer_no",
        header: () => "CustNo",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "customer_name",
        header: () => "Customer Name",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },

      {
        accessorKey: "customer_client_name",
        header: () => "Client Name",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "fork_in_date",
        header: () => "Fork in",
        cell: (info) => toGermanDate(info.getValue() as string),
        footer: (props) => props.column.id,
      },
    ];
  return columns;
}
