import { TDocument } from "@/app/data_types/documents/tdocument";
import { ColumnDef } from "@tanstack/react-table";
import { MailIcon, PrinterIcon } from "lucide-react";

const toGermanDate = (value: string) => new Date(value).toLocaleDateString(
  "de-DE",
  { day: "2-digit", month: "2-digit", year: "numeric" },
);

const getIconForStatus = (status: string) => {
  if (!status) return null;
  return status.toLowerCase().startsWith("mail")
    ? <MailIcon className="size-4 text-blue-700" />
    : <PrinterIcon className="size-4 text-teal-700" />;
};

export default function DocumentColumns() {
  const columns: ColumnDef<TDocument>[] = [
      {
        accessorKey: "doc_type",
        header: () => "Type",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        size: 110,
      },
      {
        accessorKey: "doc_no",
        header: () => "No",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        size: 60,
      },
      {
        accessorKey: "doc_date",
        header: () => "Date",
        cell: (info) => toGermanDate(info.getValue() as string),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "sent_by",
        header: () => "",
        cell: (info) => getIconForStatus(info.getValue() as string),
        footer: (props) => props.column.id,
      },
    ];

  return columns;
}
