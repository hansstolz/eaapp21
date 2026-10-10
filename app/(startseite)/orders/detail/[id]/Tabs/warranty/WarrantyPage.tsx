"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaFileInvoice } from "react-icons/fa";
import { FiMail, FiPlus, FiPrinter } from "react-icons/fi";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import type { EaOrdersPosition } from "@/app/data_types/orders/ea_orders_position";
import { CustomerCategory } from "@/app/data_types/orders/customer_category";
import { useWarrantyStore } from "@/app/stores/warranty/warranty_store";
import { useOrderStore } from "@/app/stores/order/order_store";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import { _updateWarranty } from "@/app/api/warranty/warranty_crud";
import { warrantyFormSchema, type WarrantyForm } from "@/lib/warranty-form";
import SubSection from "@/components/app/SubSection";
import HLine from "@/components/app/hline";
import { InputDate } from "@/components/app/inputdate";
import { LabeledInput } from "@/components/app/LabeledInput";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import AddTextDialog from "@/app/dialogs/texts/AddTextDialog";
import OrderTextList from "@/app/dialogs/texts/OrderTextList";

const currency = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const columns: ColumnDef<EaOrdersPosition>[] = [
  { accessorKey: "article_no", header: "No" },
  { accessorKey: "articlecode", header: "Code" },
  { accessorKey: "articlecharacter", header: "Character", cell: ({ row }) => {
    const character = row.original.articlecharacter ?? "";
    return character.length > 50 ? `${character.slice(0, 49)}...` : character;
  } },
  { accessorKey: "price_single_categ3", header: "Price", cell: ({ row }) => currency.format(row.original.price_single_categ3 ?? 0), meta: { align: "right" } },
  { accessorKey: "quantity", header: "Quantity", meta: { align: "right" } },
];

export default function WarrantyPage() {
  const [showAddText, setShowAddText] = useState(false);
  const { order } = useOrderStore();
  const { warranty, getWarrantyByUidOrder } = useWarrantyStore();
  const { positions, texts, addText, deleteText, costestimate, isConfirmed, getConfirmedCostestimate } = useCostestimateStore();
  const { control, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm<WarrantyForm>({
    resolver: zodResolver(warrantyFormSchema),
  });

  useEffect(() => {
    if (order) void getConfirmedCostestimate(order.uid_order);
  }, [getConfirmedCostestimate, order]);

  useEffect(() => {
    if (!warranty || warranty.uid_order !== order?.uid_order) return;
    reset({
      worker_warranty: warranty.worker_warranty ?? "",
      work_warranty_date: warranty.work_warranty_date,
      warranty_reason: warranty.warranty_reason ?? "",
      text_consult_warranty: warranty.text_consult_warranty ?? "",
    });
  }, [order?.uid_order, reset, warranty]);

  const submit = async (data: WarrantyForm) => {
    if (!warranty || warranty.uid_order !== order?.uid_order) return;
    try {
      await _updateWarranty(warranty.uid_warranty, data);
      await getWarrantyByUidOrder(warranty.uid_order);
      toast.success("Warranty updated");
    } catch {
      toast.error("Warranty could not be saved.");
    }
  };

  if (!warranty || warranty.uid_order !== order?.uid_order || warranty.warranty_request !== "accept") return null;
  if (!isConfirmed || costestimate?.uid_order !== order.uid_order)
    return <div className="p-12 text-xl text-primary-700">Confirm Costestimate!</div>;
  const warrantyPositions = positions.filter((position) =>
    position.uid_order === order.uid_order
      && (position.customer_category_no === CustomerCategory.warranty || position.article_warranty_int === 1),
  );
  const warrantyTexts = texts.filter((text) => text.type === 2);
  const actions = <div className="flex gap-3">
    <Button disabled={!isDirty || isSubmitting} type="submit" size="sm">Save</Button>
    <Button disabled type="button" size="sm" title="Mail workflow is not available yet"><FiMail /> Mail</Button>
    <Button disabled type="button" size="sm" title="Print workflow is not available yet"><FiPrinter /> Print</Button>
  </div>;

  return (
    <form onSubmit={handleSubmit(submit)}>
      <SubSection icon={FaFileInvoice} title={`Warranty #${warranty.warranty_no ?? ""}`} actions={actions}>
        <div className="flex justify-end gap-3">
          <LabeledInput name="worker_warranty" label="Worker" control={control} />
          <InputDate name="work_warranty_date" control={control} label="Warranty date" className="w-44" classLabel="text-xs" />
        </div>
        <HLine />
        <div className="max-h-60 overflow-auto">
          <DataTable columns={columns} data={warrantyPositions} />
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <LabeledInput name="warranty_reason" label="Warranty reason" type="textarea" rows={3} control={control} />
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <h3 className="text-sm font-medium text-secondary">Warranty texts</h3>
          <Button type="button" className="w-25" size="sm" onClick={() => setShowAddText(true)}>
            <FiPlus /> Add Text
          </Button>
          <OrderTextList
            texts={warrantyTexts}
            emptyText="No warranty texts available."
            onDelete={deleteText}
          />
        </div>
      </SubSection>
      <AddTextDialog
        open={showAddText}
        onOpenChange={setShowAddText}
        onAdd={(text) => addText({ ...text, text_no: 2 }, 2)}
      />
    </form>
  );
}
