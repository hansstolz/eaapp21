import { TDocument } from "@/data_types/documents/tdocument";
import { TForkOrder } from "@/data_types/forks/ea_forks";
import useGerman from "@/lib/hooks/useGerman";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { MailIcon, PrinterIcon } from "lucide-react";
import React, { useMemo, useState } from "react";

export default function DocumentColumns() {
  const { to2DigitDateFromString } = useGerman();

  const getIconForStatus = (status: string) => {
    if (!status) return null;
    if (status.toLowerCase().startsWith("mail")) {
      return <MailIcon className={`size-4 text-blue-700`} />;
    } else {
      return <PrinterIcon className={`size-4 text-teal-700`} />;
    }
  };
  const columns = useMemo<ColumnDef<TDocument>[]>(
    () => [
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
        cell: (info) => to2DigitDateFromString(info.getValue() as string),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "sent_by",
        header: () => "",
        cell: (info) => getIconForStatus(info.getValue() as string),
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  return columns;
}
