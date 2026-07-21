"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useOrderStore } from "@/app/stores/order/order_store";
import { usePaymentStore } from "@/app/stores/order/PaymentSlice";
import { InputDate } from "@/components/app/inputdate";
import { LabeledInput } from "@/components/app/LabeledInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/app/input";
import { Label } from "@/components/ui/label";
import { FormSelect } from "@/components/app/FormSelect";

const paymentSchema = z.object({
  payment_date: z.union([z.string(), z.date()]).nullable(),
  payment_user: z.string(),
  payment_note: z.string(),
  payment_amount: z.coerce.number().positive(),
});
type PaymentForm = z.input<typeof paymentSchema>;

export default function AddPaymentDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { order } = useOrderStore();
  const addPayment = usePaymentStore((state) => state.addPayment);
  const username = useAuthStore((state) => state.user?.username ?? "");
  const form = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { payment_date: new Date().toISOString(), payment_user: username, payment_note: "Überweisung", payment_amount: 0 },
  });
  useEffect(() => {
    form.reset({ payment_date: new Date().toISOString(), payment_user: username, payment_note: "Überweisung", payment_amount: 0 });
  }, [form, open, username]);
  const submit = form.handleSubmit(async (data) => {
    if (!order) return;
    await addPayment({
      uid_payment: 0,
      uid_order: order.uid_order,
      payment_amount: Number(data.payment_amount),
      payment_user: data.payment_user,
      payment_currency: "Euro",
      payment_note: data.payment_note,
      payment_date: data.payment_date ? new Date(data.payment_date) : null,
      user_print_language: null,
      user_group: order.user_group,
      created_at: new Date(),
      updated_at: new Date(),
    });
    setOpen(false);
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Payment</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <InputDate name="payment_date" control={form.control} label="Payment date" />
          <LabeledInput name="payment_user" control={form.control} label="User" />
          <FormSelect
            name="payment_note"
            control={form.control}
            label="Payment method"
            options={[
              { value: "Überweisung", label: "Überweisung" },
              { value: "Bar", label: "Bar" },
              { value: "PayPal", label: "PayPal" },
              { value: "Karte", label: "Karte" },
            ]}
          />
          <div className="grid gap-2">
            <Label htmlFor="payment-amount">AMOUNT</Label>
            <Input id="payment-amount" type="number" step="0.01" {...form.register("payment_amount")} />
            {form.formState.errors.payment_amount?.message && <p className="text-sm text-destructive">{form.formState.errors.payment_amount.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Close</Button>
            <Button disabled={!form.formState.isDirty} type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
