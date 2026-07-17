import { TArticleStat } from "@/app/api/sales/sales";
import useGerman from "@/lib/hooks/useGerman";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";

export default function ArticleStatColumns() {
  const { truncate } = useGerman();
  const columns = useMemo<ColumnDef<TArticleStat>[]>(
    () => [
      {
        accessorKey: "count",
        header: () => "Count",
        footer: (props) => props.column.id,
        size: 30,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "articlecode",
        header: () => "Article Code",
        footer: (props) => props.column.id,
        size: 120,
        meta: {
          align: "left",
          isEditable: false,
        },
      },

      {
        accessorKey: "articlecharacter",
        header: () => "Article Character",
        cell: (info) => truncate(info.getValue() as string, 100),
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  return columns;
}
