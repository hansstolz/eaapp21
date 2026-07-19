import { EaOrdersCustomer } from "@/app/data_types/orders/ea_orders_customer";
import { ColumnDef } from "@tanstack/react-table";

const toGermanDate = (isoString: string) =>
  new Date(isoString).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function CustomerOrdersColumns() {
  const columns: ColumnDef<EaOrdersCustomer>[] = [
      {
        accessorKey: "invoice_date",
        header: () => "Date",
        cell: (info) => toGermanDate(info.getValue() as string),
        footer: (props) => props.column.id,
        meta: {
          align: "left",
        },
      },
      {
        accessorKey: "order_no",
        header: () => "OrderNo",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        meta: {
          align: "left",
        },
      },

      {
        accessorKey: "fork_no",
        header: () => "ForkNo",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        meta: {
          align: "left",
        },
      },
      {
        accessorKey: "fork_model",
        header: () => "Fork Model",
        footer: (props) => props.column.id,
      },
    ];

  return columns;
}
