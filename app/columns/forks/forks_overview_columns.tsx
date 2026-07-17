import { EaForks } from "@/data_types/forks/ea_forks";
import { EaForksOverview } from "@/data_types/forks/ea_forks_overview";
import useGerman from "@/lib/hooks/useGerman";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export default function ForksOverviewColumns() {
  const { truncate } = useGerman();
  const columns = useMemo<ColumnDef<EaForks | EaForksOverview>[]>(
    () => [
      {
        accessorKey: "fork_no",
        header: () => "Fo",
        footer: (props) => props.column.id,
        size: 45,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "fork_model",
        header: () => "Model",
        cell: (info) => truncate(String(info.getValue() ?? ""), 40),
        footer: (props) => props.column.id,
        size: 160,
      },
      {
        accessorKey: "colour",
        header: () => "Color",
        cell: (info) => truncate(String(info.getValue() ?? ""), 15),
        footer: (props) => props.column.id,
        size: 60,
      },
      {
        accessorKey: "customer_name",
        header: () => "Customer",
        cell: (info) => truncate(String(info.getValue() ?? ""), 30),
        footer: (props) => props.column.id,
        size: 160,
      },
      {
        accessorKey: "customer_no",
        header: () => "No",
        footer: (props) => props.column.id,
        size: 40,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "client_name",
        header: () => "Client",
        cell: (info) => truncate(String(info.getValue() ?? ""), 40),
        footer: (props) => props.column.id,
        size: 160,
      },
      {
        accessorKey: "category_fork",
        header: () => "Category",
        cell: (info) => truncate(String(info.getValue() ?? ""), 40),
        footer: (props) => props.column.id,
        size: 80,
      },
    ],
    [truncate],
  );

  return columns;
}
