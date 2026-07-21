"use client";

import { useEffect, useState } from "react";
import { FaFileInvoice } from "react-icons/fa";
import { FiMail, FiPrinter } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { _getCreditnote, _updateCreditnote, type CreditnoteForm } from "@/app/api/creditnote/creditnote_crud";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import { useOrderStore } from "@/app/stores/order/order_store";
import SubSection from "@/components/app/SubSection";
import HLine from "@/components/app/hline";
import { InputDate } from "@/components/app/inputdate";
import { LabeledInput } from "@/components/app/LabeledInput";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import InvoicePositionsColumns from "../invoice/InvoicePositionsColumns";

export default function CreditnotePage() {
  const { order } = useOrderStore();
  const { positions, texts, isConfirmed, getConfirmedCostestimate, savePosition } = useCostestimateStore();
  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<CreditnoteForm>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (order) void getConfirmedCostestimate(order.uid_order);
  }, [getConfirmedCostestimate, order]);
  useEffect(() => {
    if (!order) return;
    void _getCreditnote(order.uid_order).then((creditnote) => {
      reset({
        worker_creditnote: creditnote?.worker_creditnote ?? "",
        creditnote_date: creditnote?.creditnote_date ?? new Date().toISOString(),
      });
      setLoaded(true);
    });
  }, [order, reset]);

  const submit = async (data: CreditnoteForm) => {
    if (!order) return;
    await _updateCreditnote(order.uid_order, data);
    reset(data);
    toast.success("Creditnote updated");
  };
  const columns = InvoicePositionsColumns((position, checked) => {
    void savePosition({ ...position, article_creditnote_int: checked ? 1 : 0 });
  });
  const creditPositions = positions.filter((position) => position.article_creditnote_int === 1);
  const creditTexts = texts.filter((text) => text.type === 3);

  if (!isConfirmed) return <div className="p-12 text-xl text-primary-700">Confirm Costestimate!</div>;
  const actions = <div className="flex gap-3">
    <Button disabled={!isDirty || !loaded} type="submit" size="sm">Save</Button>
    <Button disabled type="button" size="sm"><FiMail /> Mail</Button>
    <Button disabled type="button" size="sm"><FiPrinter /> Print</Button>
  </div>;
  return (
    <form onSubmit={handleSubmit(submit)}>
      <SubSection icon={FaFileInvoice} title="Creditnote" actions={actions}>
        <div className="flex justify-end gap-3">
          <LabeledInput name="worker_creditnote" label="Worker" control={control} />
          <InputDate name="creditnote_date" control={control} label="Credit date" className="w-44" classLabel="text-xs" />
        </div>
        <HLine />
        <div className="max-h-60 overflow-auto">
          <DataTable columns={columns} data={creditPositions} columnVisibility={{ customer_category_no: false }} />
        </div>
        <HLine />
        <div className="grid gap-2">
          <h3 className="text-sm font-medium text-secondary">Creditnote texts</h3>
          {creditTexts.length ? creditTexts.map((text) => (
            <div key={text.uid_orders_texts} className="rounded-md border bg-slate-50 px-3 py-2 text-sm">{text.text || "--"}</div>
          )) : <p className="text-sm text-muted-foreground">No creditnote texts available.</p>}
        </div>
      </SubSection>
    </form>
  );
}
