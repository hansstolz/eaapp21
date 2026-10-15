import type { ColumnDef } from "@tanstack/react-table";
import { PrinterIcon } from "lucide-react";
import type { EaWarrantyOverview } from "@/app/data_types/warranty/ea_warranty_overview";

const date = (value: unknown) => value ? String(value).slice(0, 10) : "";
const amount = (value: unknown) => value == null ? "" : Number(value).toFixed(2);

export const warrantyOverviewColumns: ColumnDef<EaWarrantyOverview>[] = [
  { accessorKey: "warranty_invoice_no", header: "No", size: 100 },
  { accessorKey: "warranty_invoice_date", header: "Date", size: 100, cell: info => date(info.getValue()) },
  { accessorKey: "sum_price_warranty", header: "Sum", size: 100, meta: { align: "right" }, cell: info => amount(info.getValue()) },
  { accessorKey: "total_price_warranty", header: "Total", size: 100, meta: { align: "right" }, cell: info => amount(info.getValue()) },
  { accessorKey: "total_payment_warranty", header: "Payment", size: 100, meta: { align: "right" }, cell: info => amount(info.getValue()) },
  { accessorKey: "payment_date", header: "Date", size: 100, cell: info => date(info.getValue()) },
  { accessorKey: "open_price_warranty", header: "Open", size: 100, meta: { align: "right", className: "text-[#ff0000]" }, cell: info => <span className="text-[#ff0000]">{amount(info.getValue())}</span> },
  { id: "document", header: "Document", size: 100, enableSorting: false,
    meta: { align: "center", showTooltip: false },
    cell: () => <span className="inline-flex items-center justify-center" title="Druck für Warranty-Rechnungen ist noch nicht angebunden."><PrinterIcon className="size-4" aria-label="Drucken – noch nicht verfügbar" /></span> },
];
