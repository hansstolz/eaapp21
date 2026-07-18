import { EaMailOverview } from "@/app/data_types/mails/mail_overview";
import Trash from "@/components/app/trash";
import { ColumnDef } from "@tanstack/react-table";
import { MailIcon, PrinterIcon } from "lucide-react";
import React, { useMemo } from "react";

export default function MailColumns() {
  const columns = useMemo<ColumnDef<EaMailOverview>[]>(
    () => [
      {
        accessorKey: "mail_date",
        header: () => "Date",
        cell: (info) => to2DigitDateFromString(info.getValue() as string),
        footer: (props) => props.column.id,
        size: 60,
        minSize: 60,
        maxSize: 80,
        meta: {
          className: "max-w-[60px] truncate",
        },
      },
      {
        accessorKey: "customer",
        header: () => "Customer",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        meta: {
          className: "font-semibold max-w-[220px] truncate",
          isEditable: false,
        },
      },
      {
        accessorKey: "subject",
        header: () => "Subject",
        size: 350,
        minSize: 300,
        maxSize: 400,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        meta: {
          className: "max-w-[350px] truncate",
        },
      },
      {
        accessorKey: "mail_status",
        header: () => "Status",
        cell: (info) => getIconForStatus(info.getValue() as string),
        footer: (props) => props.column.id,
        size: 20,
        minSize: 20,
        maxSize: 20,
        meta: {
          className: "max-w-[40px] truncate",
        },
      },

      {
        accessorKey: "uid_mail",
        header: "",
        size: 48, // Platz fuer Icon + Padding
        minSize: 40,
        maxSize: 56,
        cell: () => {
          return <Trash />;
        },
        meta: {
          className: "p-0",
          isEditable: false,
          align: "right",
          isClickable: true,
          showTooltip: false,
        },
      },
    ],
    [],
  );

  return columns;
}

function getIconForStatus(status: string) {
  if (!status) return null;
  return status.toLowerCase().includes("mail") ? (
    <MailIcon className="size-4 text-blue-700" />
  ) : (
    <PrinterIcon className="size-4 text-teal-700" />
  );
}

function to2DigitDateFromString(isoString: string) {
  return new Date(isoString).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
