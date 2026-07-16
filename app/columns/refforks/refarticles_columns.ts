import { RefArticle } from "@/data_types/ref_forks/ref_forks";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export default function RefArticlesColumns() {
  const columns = useMemo<ColumnDef<RefArticle>[]>(
    () => [
      {
        accessorKey: "article_no",
        header: () => "ArticleNo",
        footer: (props) => props.column.id,
      },

      {
        accessorKey: "articlecode",
        header: () => "Article Code",
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  return columns;
}
