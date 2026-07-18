import { ColumnDef } from "@tanstack/react-table";
import { EaContacts } from "@/app/schemas/contacts/contact_schema";
import Trash from "@/components/app/trash";

export default function ContactsColumns() {
  const columns: ColumnDef<EaContacts>[] = [
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
        },
      },
      {
        accessorKey: "uid_contact",
        header: () => "D",
        footer: (props) => props.column.id,
        cell: () => <Trash />,
        size: 30,
        meta: {
          align: "right",
          isClickable: true,
        },
      },
    ];

  return columns;
}

function truncate(value: string | null | undefined, length: number) {
  if (!value) return "";
  return value.length > length ? `${value.slice(0, length - 1)}...` : value;
}
