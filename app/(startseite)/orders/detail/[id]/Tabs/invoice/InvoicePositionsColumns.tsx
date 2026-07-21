"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { EaOrdersPosition } from "@/app/data_types/orders/ea_orders_position";
import { CustomerCategory } from "@/app/data_types/orders/customer_category";
import { Checkbox } from "@/components/ui/checkbox";

const currency = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export default function InvoicePositionsColumns(
  onCreditnoteChange: (position: EaOrdersPosition, checked: boolean) => void,
): ColumnDef<EaOrdersPosition>[] {
  const price = (position: EaOrdersPosition) => {
    switch (position.customer_category_no) {
      case CustomerCategory.private: return position.price_single_categ2;
      case CustomerCategory.warranty: return position.price_single_categ3;
      default: return position.price_single_categ1;
    }
  };

  return [
    { accessorKey: "article_no", header: "No" },
    { accessorKey: "articlecode", header: "Code" },
    {
      accessorKey: "articlecharacter",
      header: "Character",
      cell: ({ row }) => row.original.articlecharacter ?? "",
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }) => <div className="text-right">{currency.format(price(row.original))}</div>,
    },
    { accessorKey: "quantity", header: "Quantity" },
    {
      accessorKey: "article_creditnote_int",
      header: "CN",
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.article_creditnote_int === 1}
          onCheckedChange={(checked) => onCreditnoteChange(row.original, checked === true)}
          aria-label={`Creditnote for position ${row.original.article_no ?? ""}`}
        />
      ),
    },
    { accessorKey: "customer_category_no", header: "Category" },
  ];
}
