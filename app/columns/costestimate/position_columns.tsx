"use client";
import { CustomerCategory } from "@/data_types/orders/customer_category";
import { EaOrdersPositions } from "@/data_types/positions/ea_orders_positions";
import useGerman from "@/lib/hooks/useGerman";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { FiDelete } from "react-icons/fi";

export default function PositionsColumns() {
  const { toCurrency, truncate } = useGerman();

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
    } else return toCurrency(info.getValue() as number);
  };

  const columns = useMemo<ColumnDef<EaOrdersPositions>[]>(
    () => [
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
          width: "400px",
        },
      },

      {
        accessorKey: "price_single_categ2",
        header: () => "Private",
        cell: (info) => showPrice(info, CustomerCategory.private),
        footer: (props) => props.column.id,
        meta: {
          align: "right",
          width: "100px",
        },
      },
      {
        accessorKey: "price_single_categ1",
        header: () => "dealer",
        cell: (info) => showPrice(info, CustomerCategory.dealer),
        footer: (props) => props.column.id,
        meta: {
          align: "right",
          width: "100px",
        },
      },
      {
        accessorKey: "price_single_categ3",
        header: () => "Warranty",
        cell: (info) => showPrice(info, CustomerCategory.warranty),
        footer: (props) => props.column.id,
        meta: {
          align: "right",
          width: "100px",
        },
      },
      {
        accessorKey: "quantity",
        header: () => "Quantity",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        meta: {
          align: "right",
          width: "100px",
        },
      },

      {
        accessorKey: "uid_orders_position",
        header: () => "Del",
        footer: (props) => props.column.id,
        cell: (info) => (
          <div className="text-primary">
            <FiDelete />
          </div>
        ),
        meta: {
          align: "right",
          width: "50px",
        },
      },
    ],
    [],
  );

  return columns;
}
