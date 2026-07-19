import { TForkOrder } from "@/app/data_types/forks/ea_forks";
import { ColumnDef } from "@tanstack/react-table";

const toGermanDate = (isoString: string) =>
  new Date(isoString).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function ForkOrdersColumns() {
  const columns: ColumnDef<TForkOrder>[] = [
      {
        accessorKey: "invoice_date",
        header: () => "Date",
        cell: (info) => toGermanDate(info.getValue() as string),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "customer_no",
        header: () => "Cust No",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        size: 80,
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
        header: () => "Fork In",
        cell: (info) => toGermanDate(info.getValue() as string),
        footer: (props) => props.column.id,
        size: 80,
      },
    ];

  return columns;
}
