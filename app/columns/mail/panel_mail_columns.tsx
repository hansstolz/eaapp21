import { EaMails } from "@/app/data_types/forms/ea_mails";
import useGerman from "@/lib/hooks/useGerman";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export default function MailsColumns() {
  const { to2DigitDateFromString } = useGerman();
  const columns = useMemo<ColumnDef<EaMails>[]>(
    () => [
      {
        accessorKey: "mail_date",
        header: () => "Date",
        cell: (info) => to2DigitDateFromString(info.getValue() as string),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "subject",
        header: () => "Subject",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
    ],
    [to2DigitDateFromString],
  );

  return columns;
}
