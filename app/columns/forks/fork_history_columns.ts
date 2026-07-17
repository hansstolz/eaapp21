import { EaForkHistory } from "@/data_types/forks/ea_fork_history";
import useGerman from "@/lib/hooks/useGerman";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export default function ForkHistCol() {
  const { to2DigitDateFromString } = useGerman();
  const columns = useMemo<ColumnDef<EaForkHistory>[]>(
    () => [
      {
        accessorKey: "created_at",
        header: () => "Date",
        cell: (info) => to2DigitDateFromString(info.getValue() as string),
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
        cell: (info) => to2DigitDateFromString(info.getValue() as string),
        footer: (props) => props.column.id,
      },
    ],
    [],
  );
  return columns;
}
