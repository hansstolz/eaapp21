"use client";

import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaReadme } from "react-icons/fa";
import { FiMail, FiPrinter } from "react-icons/fi";
import { toast } from "sonner";
import { _updateOrder } from "@/app/api/orders/orders_crud";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import { useOrderStore } from "@/app/stores/order/order_store";
import HLine from "@/components/app/hline";
import { InputDate } from "@/components/app/inputdate";
import { LabeledInput } from "@/components/app/LabeledInput";
import SubSection from "@/components/app/SubSection";
import { Button } from "@/components/ui/button";

const reminderSchema = z.object({
  reminderDate: z.union([z.string(), z.date()]).nullable(),
  reminderReference: z.string(),
  reminderLevelName: z.string(),
  reminderLevel: z.coerce.number().int().min(0),
  reminderText: z.string(),
});
type ReminderForm = z.input<typeof reminderSchema>;
type ReminderResult = z.output<typeof reminderSchema>;

export default function RemindersPage() {
  const { order, getOrderById } = useOrderStore();
  const { isConfirmed, getConfirmedCostestimate } = useCostestimateStore();
  const form = useForm<ReminderForm, unknown, ReminderResult>({ resolver: zodResolver(reminderSchema) });
  const dirty = useRef(false);
  useEffect(() => { dirty.current = form.formState.isDirty; }, [form.formState.isDirty]);
  useEffect(() => {
    if (!order) return;
    void getConfirmedCostestimate(order.uid_order);
    form.reset({
      reminderDate: new Date(order.reminderDate).toISOString(),
      reminderReference: "Zahlungserinnerung",
      reminderLevelName: "Mahnstufe",
      reminderLevel: order.reminderLevel,
      reminderText: order.reminderText,
    });
  }, [form, getConfirmedCostestimate, order]);
  const submit = useCallback(async (data: ReminderResult) => {
    if (!order) return;
    await _updateOrder({
      ...order.getOrder(),
      reminder_date: data.reminderDate instanceof Date ? data.reminderDate.toISOString() : (data.reminderDate ?? ""),
      reminder_level: data.reminderLevel,
      text_payments: data.reminderText,
    });
    await getOrderById(order.uid_order);
    toast.success("Reminder updated");
  }, [getOrderById, order]);
  useEffect(() => () => {
    if (dirty.current) void form.handleSubmit(submit)();
  }, [form, submit]);
  if (!isConfirmed) return <div className="p-12 text-xl text-primary-700">Confirm Costestimate!</div>;
  const actions = <div className="flex gap-3">
    <Button disabled={!form.formState.isDirty} type="submit" size="sm">Save</Button>
    <Button disabled type="button" size="sm"><FiMail /> Mail</Button>
    <Button disabled type="button" size="sm"><FiPrinter /> Print</Button>
  </div>;
  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <SubSection icon={FaReadme} title="Reminders" actions={actions}>
        <HLine />
        <div className="grid max-w-3xl gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[11rem_1fr_1fr_7rem]">
            <InputDate name="reminderDate" control={form.control} label="Date" />
            <LabeledInput disabled name="reminderReference" control={form.control} label="Text" />
            <LabeledInput disabled name="reminderLevelName" control={form.control} label="Reminder" />
            <LabeledInput name="reminderLevel" control={form.control} label="Level" />
          </div>
          <LabeledInput type="textarea" rows={6} name="reminderText" control={form.control} label="Text" />
        </div>
        <HLine />
      </SubSection>
    </form>
  );
}
