import { CellContext, ColumnDef } from "@tanstack/react-table";
import { FiDelete } from "react-icons/fi";
import React, { useMemo, useState } from "react";
import useGerman from "@/lib/hooks/useGerman";
import { EaContacts } from "@/schemas/contacts/contact_schema";
import Trash from "@/components/general/trash";

export default function ContactsColumns() {
  const { truncate } = useGerman();
  const columns = useMemo<ColumnDef<EaContacts>[]>(
    () => [
      {
        accessorKey: "last_name",
        header: () => "Last Name",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "first_name",
        header: () => "First Name",
        cell: (info) => truncate(info.getValue() as string, 60),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "streetaddress",
        header: () => "Street",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },

      {
        accessorKey: "city",
        header: () => "City",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "phone",
        header: () => "Phone",
        cell: (info) => truncate(info.getValue() as string, 30),
        footer: (props) => props.column.id,
        meta: {
          align: "left",
          width: "200px",
        },
      },
      {
        accessorKey: "uid_contact",
        header: () => "D",
        footer: (props) => props.column.id,
        cell: (info) => <Trash />,
        size: 30,
        meta: {
          align: "right",
          isClickable: true,
        },
      },
    ],
    [],
  );

  return columns;
}
