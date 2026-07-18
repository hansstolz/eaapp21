import { EaArticleOverview } from "@/app/data_types/articles/article_overview";
import { ColumnDef } from "@tanstack/react-table";

export default function ArticlesOverviewColumns() {
  const columns: ColumnDef<EaArticleOverview>[] = [
      {
        accessorKey: "article_no",
        header: () => "No",
        footer: (props) => props.column.id,
        size: 60,
      },
      {
        accessorKey: "articlecode",
        header: () => "Article Code",
        footer: (props) => props.column.id,
        size: 160,
      },
      {
        accessorKey: "articlecharacter",
        header: () => "Description",
        cell: (info) => truncate(String(info.getValue() ?? ""), 40),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "article_group",
        header: () => "Group",
        footer: (props) => props.column.id,
        size: 70,
      },
      {
        accessorKey: "category_article",
        header: () => "Category",
        footer: (props) => props.column.id,
        size: 70,
      },
      {
        accessorKey: "quantity",
        header: () => "Qty",
        cell: (info) => String(info.getValue() ?? ""),
        footer: (props) => props.column.id,
        size: 30,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "cost_price",
        header: () => "Cost",
        cell: (info) => {
          const value = info.getValue();
          return value === null || value === undefined
            ? ""
            : toCurrency(Number(value));
        },
        footer: (props) => props.column.id,
        size: 40,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "price_netto_categ1",
        header: () => "Dealer",
        cell: (info) => {
          const value = info.getValue();
          return value === null || value === undefined
            ? ""
            : toCurrency(Number(value));
        },
        footer: (props) => props.column.id,
        size: 40,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
      {
        accessorKey: "price_netto_categ2",
        header: () => "Cust",
        cell: (info) => {
          const value = info.getValue();
          return value === null || value === undefined
            ? ""
            : toCurrency(Number(value));
        },
        footer: (props) => props.column.id,
        size: 40,
        meta: {
          align: "right",
          isEditable: false,
        },
      },
    ];

  return columns;
}

const euroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

function toCurrency(value: number) {
  return euroFormatter.format(value);
}

function truncate(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length - 1)}...` : value;
}
