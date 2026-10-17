"use client";

import { useState } from "react";
import { PrinterIcon } from "lucide-react";
import { toast } from "sonner";

export function WarrantyInvoicePrint({ invoiceNo }: { invoiceNo: number | null }) {
  const [busy, setBusy] = useState(false);
  async function printInvoice() {
    if (!invoiceNo || busy) return;
    const preview = window.open("", "_blank");
    if (!preview) { toast.error("Bitte Pop-ups für die Druckvorschau erlauben."); return; }
    preview.document.title = "Gewährleistungsrechnung";
    preview.document.body.textContent = "Rechnung wird geladen …";
    preview.opener = null;
    setBusy(true);
    try {
      const response = await fetch("/warranty/invoice_document", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warranty_invoice_no: invoiceNo }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Rechnung konnte nicht geladen werden.");
      }
      const url = URL.createObjectURL(await response.blob());
      if (preview.closed) { URL.revokeObjectURL(url); return; }
      preview.onload = () => { preview.focus(); preview.print(); };
      preview.location.href = url;
      // Keep the PDF available while the viewer and print dialog use it.
      const cleanup = window.setInterval(() => {
        if (preview.closed) { URL.revokeObjectURL(url); window.clearInterval(cleanup); }
      }, 1000);
    } catch (error) {
      preview.close();
      toast.error(error instanceof Error ? error.message : "Drucken fehlgeschlagen.");
    } finally { setBusy(false); }
  }
  return <button type="button" disabled={!invoiceNo || busy} aria-label="Gewährleistungsrechnung drucken"
    title={busy ? "Rechnung wird geladen …" : "Gewährleistungsrechnung drucken"}
    className="inline-flex items-center justify-center disabled:opacity-50"
    onDoubleClick={event => event.stopPropagation()}
    onClick={event => { event.stopPropagation(); void printInvoice(); }}>
    <PrinterIcon className="size-4" />
  </button>;
}
