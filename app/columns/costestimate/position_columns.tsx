"use client";
import { CustomerCategory } from "@/app/data_types/orders/customer_category";
import { EaOrdersPositions } from "@/app/data_types/positions/ea_orders_positions";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { FiDelete } from "react-icons/fi";

const euroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const toCurrency = (value: number) => euroFormatter.format(value);
const truncate = (value: string | null, length = 50) =>
  value && value.length > length
    ? `${value.slice(0, length - 1)}...`
    : (value ?? "");

const showPrice = (
  info: CellContext<EaOrdersPositions, unknown>,
  no: number,
) => {
    if (info.row.getValue("customer_category_no") === no) {
      return (
        <div className="text-primary">
          {toCurrency(info.getValue() as number)}
        </div>
      );
    }
    return toCurrency(info.getValue() as number);
};

export default function PositionsColumns() {
  const columns: ColumnDef<EaOrdersPositions>[] = [
      {
        accessorKey: "article_no",
        header: () => "No",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "customer_category_no",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },

      {
        accessorKey: "articlecode",
        header: () => "Code",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "articlecharacter",
        header: () => "Character",
        cell: (info) => truncate(info.getValue() as string),
        footer: (props) => props.column.id,
        meta: {
        },
      },

      {
        accessorKey: "price_single_categ2",
        header: () => "Private",
        cell: (info) => showPrice(info, CustomerCategory.private),
        footer: (props) => props.column.id,
        meta: {
          align: "right",
        },
      },
      {
        accessorKey: "price_single_categ1",
        header: () => "dealer",
        cell: (info) => showPrice(info, CustomerCategory.dealer),
        footer: (props) => props.column.id,
        meta: {
          align: "right",
        },
      },
      {
        accessorKey: "price_single_categ3",
        header: () => "Warranty",
        cell: (info) => showPrice(info, CustomerCategory.warranty),
        footer: (props) => props.column.id,
        meta: {
          align: "right",
        },
      },
      {
        accessorKey: "quantity",
        header: () => "Quantity",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        meta: {
          align: "right",
        },
      },

      {
        accessorKey: "uid_orders_position",
        header: () => "Del",
        footer: (props) => props.column.id,
        cell: () => (
          <div className="text-primary">
            <FiDelete />
          </div>
        ),
        meta: {
          align: "right",
          isClickable: true,
        },
      },
    ];

  return columns;
}
