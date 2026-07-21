"use client";

import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { FaEuroSign } from "react-icons/fa";
import { FiDelete, FiPlus, FiPrinter } from "react-icons/fi";
import type { EaPayments } from "@/app/data_types/payments/ea_payments";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import { useDeleteStore } from "@/app/stores/delete/delete_slice";
import { useOrderStore } from "@/app/stores/order/order_store";
import { usePaymentStore } from "@/app/stores/order/PaymentSlice";
import AskFor from "@/components/app/ask_for";
import HLine from "@/components/app/hline";
import SubSection from "@/components/app/SubSection";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import AddPaymentDialog from "./AddPaymentDialog";

const date = new Intl.DateTimeFormat("de-DE");
const currency = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export default function PaymentsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const { order } = useOrderStore();
  const { isConfirmed, getConfirmedCostestimate } = useCostestimateStore();
  const { payments, getPayments, deletePayment } = usePaymentStore();
  const openDeleteDialog = useDeleteStore((state) => state.openDeleteDialog);
  useEffect(() => {
    if (!order) return;
    void getConfirmedCostestimate(order.uid_order);
    void getPayments(order.uid_order);
  }, [getConfirmedCostestimate, getPayments, order]);
  const columns: ColumnDef<EaPayments>[] = [
    { accessorKey: "payment_date", header: "Date", cell: ({ row }) => row.original.payment_date ? date.format(new Date(row.original.payment_date)) : "--" },
    { accessorKey: "payment_user", header: "User" },
    { accessorKey: "payment_note", header: "Note" },
    { accessorKey: "payment_amount", header: "Amount", cell: ({ row }) => <div className="text-right">{currency.format(row.original.payment_amount)}</div> },
    { accessorKey: "payment_currency", header: "Currency" },
    { id: "delete", header: "Del", cell: ({ row }) => (
      <Button type="button" variant="ghost" size="icon-sm" onClick={() => openDeleteDialog({
        uid: row.original.uid_payment,
        label: `${currency.format(row.original.payment_amount)} ${row.original.payment_note ?? ""}`,
        title: "Delete Payment",
        delete: async (uid) => { await deletePayment(uid); },
      })}><FiDelete /><span className="sr-only">Delete payment</span></Button>
    ) },
  ];
  if (!isConfirmed) return <div className="p-12 text-xl text-primary-700">Confirm Costestimate!</div>;
  const actions = <Button disabled type="button" size="sm"><FiPrinter /> Print</Button>;
  return (
    <SubSection icon={FaEuroSign} title="Payments" actions={actions}>
      <HLine />
      <div className="grid gap-3">
        <Button type="button" className="w-fit" size="sm" onClick={() => setShowAdd(true)}><FiPlus /> Add Payment</Button>
        <div className="max-h-60 overflow-auto"><DataTable columns={columns} data={payments} /></div>
      </div>
      <AddPaymentDialog open={showAdd} setOpen={setShowAdd} />
      <AskFor />
    </SubSection>
  );
}
