"use client";

import { FaFileInvoiceDollar } from "react-icons/fa";
import { useState } from "react";
import { FiMail, FiPrinter } from "react-icons/fi";
import SubSection from "@/components/app/SubSection";
import HLine from "@/components/app/hline";
import { InputDate } from "@/components/app/inputdate";
import { LabeledInput } from "@/components/app/LabeledInput";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import InvoiceController from "./InvoiceController";
import InvoicePositionsColumns from "./InvoicePositionsColumns";
import AddTextDialog from "@/app/dialogs/texts/AddTextDialog";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import OrderTextList from "@/app/dialogs/texts/OrderTextList";

export default function InvoicePage() {
  const [showAddText, setShowAddText] = useState(false);
  const { addText, deleteText } = useCostestimateStore();
  const {
    control,
    handleSubmit,
    isDirty,
    positions,
    texts,
    isConfirmed,
    savePosition,
    submitHandler,
  } = InvoiceController();

  const columns = InvoicePositionsColumns((position, checked) => {
    void savePosition({ ...position, article_creditnote_int: checked ? 1 : 0 });
  });
  const invoiceTexts = texts.filter((text) => text.type === 1);

  if (!isConfirmed) {
    return <div className="p-12 text-xl text-primary-700">Confirm Costestimate!</div>;
  }

  const actions = (
    <div className="flex gap-3">
      <Button disabled={!isDirty} type="submit" size="sm">Save</Button>
      <Button disabled type="button" size="sm" title="Mail workflow is not available yet"><FiMail /> Mail</Button>
      <Button disabled type="button" size="sm" title="Print workflow is not available yet"><FiPrinter /> Print</Button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <SubSection icon={FaFileInvoiceDollar} title="Invoice" actions={actions}>
        <div className="flex justify-end gap-3">
          <LabeledInput name="worker_invoice" label="Worker" control={control} />
          <InputDate name="invoice_date" control={control} label="Invoice date" className="w-44" classLabel="text-xs" />
        </div>
        <HLine />
        <div className="max-h-60 overflow-auto">
          <DataTable
            columns={columns}
            data={positions}
            columnVisibility={{ customer_category_no: false }}
          />
        </div>
        <div className="mt-6 grid gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-secondary">Invoice texts</h3>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowAddText(true)}>
              Add text
            </Button>
          </div>
          <OrderTextList
            texts={invoiceTexts}
            emptyText="No invoice texts available."
            onDelete={deleteText}
          />
        </div>
      </SubSection>
      <AddTextDialog
        open={showAddText}
        onOpenChange={setShowAddText}
        onAdd={(text) => addText(text, 1)}
      />
    </form>
  );
}
