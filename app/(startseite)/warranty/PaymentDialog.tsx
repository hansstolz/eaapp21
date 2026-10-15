"use client";

import { useState } from "react";
import type { EaWarrantyOverview } from "@/app/data_types/warranty/ea_warranty_overview";
import { DialogDescription, DialogFooter } from "@/components/ui/dialog";
import MovableDialog from "@/components/app/movable_dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { paymentCents, remainingWarrantyCents } from "@/lib/warranty-payment";

export default function PaymentDialog({ invoice, onClose, onSaved }: {
  invoice: EaWarrantyOverview;
  onClose: () => void;
  onSaved: (invoice: EaWarrantyOverview) => void;
}) {
  const [amount, setAmount] = useState("0");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [today] = useState(() => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(new Date()));
  const cents = paymentCents(amount);
  const remaining = remainingWarrantyCents(invoice.total_price_warranty, invoice.total_payment_warranty);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !cents || cents > remaining) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/warranty/add_payment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid_warranty_invoice: invoice.uid_warranty_invoice, amount, payment_date: today }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Zahlung konnte nicht gespeichert werden.");
      onSaved(result);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Speichern fehlgeschlagen.");
    } finally { setBusy(false); }
  }
  return <MovableDialog open setOpen={open => { if (!open && !busy) onClose(); }} title="Payment" className="min-w-md max-w-lg">
      <form onSubmit={save}>
        <div className="grid gap-4 pb-4">
          <DialogDescription className="sr-only">Zahlung für die Warranty-Rechnung erfassen.</DialogDescription>
          <div className="grid gap-2"><Label htmlFor="warranty-payment-number" >Warranty invoice</Label>
            <Input id="warranty-payment-number" value={invoice.warranty_invoice_no ?? ""} readOnly className="bg-muted" /></div>
          <div className="grid gap-2"><Label htmlFor="warranty-payment-date" >Date</Label>
            <Input id="warranty-payment-date" value={today.split("-").reverse().join(".")} readOnly className="bg-muted" /></div>
          <div className="grid gap-2"><Label htmlFor="warranty-payment-amount" >Amount</Label>
            <Input id="warranty-payment-amount" inputMode="decimal" autoFocus value={amount} onChange={event => setAmount(event.target.value)} disabled={busy} />
            {cents !== null && cents > remaining && <p role="alert" className="text-red-600">Maximal {(remaining / 100).toFixed(2)} möglich.</p>}</div>
          {error && <p role="alert" className="text-red-600">{error}</p>}
        </div>
        <DialogFooter className="border-t pt-4">
          <Button type="button" disabled={busy} onClick={onClose} variant="outline">Cancel</Button>
          <Button type="submit" disabled={busy || !cents || cents > remaining}>{busy ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </form>
  </MovableDialog>;
}
