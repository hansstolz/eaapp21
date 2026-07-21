import { useCallback, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { _updateOrder } from "@/app/api/orders/orders_crud";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import { useOrderStore } from "@/app/stores/order/order_store";
import { invoiceSchema, type InvoiceForm } from "./InvoiceSchema";

export default function InvoiceController() {
  const { order, getOrderById } = useOrderStore();
  const {
    positions,
    texts,
    isConfirmed,
    savePosition,
    getConfirmedCostestimate,
  } = useCostestimateStore();
  const form = useForm<InvoiceForm>({ resolver: zodResolver(invoiceSchema) });
  const { reset, handleSubmit, formState: { isDirty } } = form;
  const dirty = useRef(false);

  useEffect(() => {
    dirty.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    if (!order) return;
    reset({
      worker_invoice: order.worker_invoice || "",
      invoice_date: order.invoice_date || new Date().toISOString(),
    });
  }, [order, reset]);

  useEffect(() => {
    if (order) void getConfirmedCostestimate(order.uid_order);
  }, [getConfirmedCostestimate, order]);

  const submitHandler = useCallback(async (data: InvoiceForm) => {
    if (!order) return;
    await _updateOrder({
      ...order.getOrder(),
      worker_invoice: data.worker_invoice ?? "",
      invoice_date: data.invoice_date instanceof Date
        ? data.invoice_date.toISOString()
        : (data.invoice_date ?? ""),
    });
    await getOrderById(order.uid_order);
    toast.success("Invoice updated");
  }, [getOrderById, order]);

  useEffect(() => () => {
    if (dirty.current) void handleSubmit(submitHandler)();
  }, [handleSubmit, submitHandler]);

  return {
    ...form,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    positions,
    texts,
    isConfirmed,
    savePosition,
    submitHandler,
  };
}
