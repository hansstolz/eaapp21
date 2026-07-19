"use client";

import ForkPartColumns from "@/app/columns/orders/fork_part_columnts";
import { EaForksParts } from "@/app/data_types/forks/ea_forks";
import OrderForkDialog from "@/app/dialogs/order/order_fork_dialog";
import ForkHistoryDialog from "@/app/dialogs/order/order_fork_history";
import ForkPartDialog from "@/app/dialogs/order/order_forkparts";
import { useDeleteStore } from "@/app/stores/delete/delete_slice";
import { useForkPartsStore } from "@/app/stores/order/fp_store";
import { useOrderStore } from "@/app/stores/order/order_store";
import AskFor from "@/components/app/ask_for";
import DisabledInput from "@/components/app/DisabledInput";
import LineRow from "@/components/app/LineRow";
import Section from "@/components/app/Section";
import { DataTable } from "@/components/app/tanstack_table/data_table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Row } from "@tanstack/react-table";

import React, { useEffect, useState } from "react";
import { FiEdit, FiFilePlus, FiPlus } from "react-icons/fi";

export default function ForkCard() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showForkHistory, setShowForkHistory] = useState(false);
  const { order } = useOrderStore();
  const columns = ForkPartColumns();
  const getForkParts = useForkPartsStore((state) => state.getForkParts);
  const forkParts = useForkPartsStore((state) => state.items);
  const [showFPDialog, setShowFPDialog] = useState(false);
  const onOpenDialog = useForkPartsStore((state) => state.onOpenDialog);
  const openDeleteDialog = useDeleteStore((state) => state.openDeleteDialog);
  const deleteForkPart = useForkPartsStore((state) => state.deleteForkPart);

  useEffect(() => {
    if (order?.uid_fork) void getForkParts(order.uid_fork);
  }, [getForkParts, order]);

  const openEditDialog = () => {
    setShowEditDialog(true);
  };
  const openForkHistory = () => {
    setShowForkHistory(true);
  };

  const addForksPart = () => {
    onOpenDialog(true, 0, null);
    setShowFPDialog(true);
  };

  const onEditForkPart = (row: Row<EaForksParts>) => {
    // Logic to open the edit dialog for the specific fork part

    onOpenDialog(false, row.index, row.original);
    setShowFPDialog(true);
  };

  const askForDelete = (row: Row<EaForksParts>) => {
    if (row.original.uid_forks_part) {
      openDeleteDialog({
        uid: row.original.uid_forks_part,
        label: row.original.forks_part_name ?? "",
        title: "Delete",
        delete: async (uid: number) => deleteForkPart(uid),
      });
    }
  };

  const actions = () => {
    return (
      <div className="flex flex-row gap-3">
        <Button onClick={openForkHistory} size="sm">
          <FiFilePlus /> History
        </Button>
        <Button onClick={openEditDialog} size="sm">
          <FiEdit /> Edit
        </Button>
      </div>
    );
  };
  return (
    <Card className="h-125">
      <Section no={2} title={"Fork"} actions={actions()}>
        <div className="w-full flex flex-col gap-3">
          <LineRow className={"justify-between"}>
            <DisabledInput label={"Fork No"}>{order?.fork_no}</DisabledInput>
            <DisabledInput label={"Fork Color"}>
              {order?.fork_color}
            </DisabledInput>
          </LineRow>
          <DisabledInput label={"Fork model"}>
            {order?.fork_model}
          </DisabledInput>
          <LineRow className="justify-end">
            <Button onClick={addForksPart} size="sm" title="Add">
              <FiPlus />
              Add Part
            </Button>
          </LineRow>
          <div className="max-h-19 overflow-y-scroll">
            <DataTable
              showHeader={false}
              onDoubleClick={onEditForkPart} // Function to handle double-click on a row for editing
              data={forkParts}
              columns={columns}
              onCellClick={askForDelete}
            />
          </div>
          <AskFor />

          <DisabledInput className="max-w-10" label={"Wheel size"}>
            {order?.wheelsize}
          </DisabledInput>
          <LineRow className={"justify-between"}>
            <DisabledInput label={"Fork In"}>
              {order?.fork_in_date_str}
            </DisabledInput>
            <DisabledInput label={"Carrier"}>
              {order?.fork_in_carrier}
            </DisabledInput>
          </LineRow>

          <DisabledInput label={"Client"}>
            {order?.customer_client_name}
          </DisabledInput>
        </div>
        {showEditDialog && (
          <OrderForkDialog
            isOpen={showEditDialog}
            setIsOpen={setShowEditDialog}
          />
        )}

        {showFPDialog && (
          <ForkPartDialog isOpen={showFPDialog} setIsOpen={setShowFPDialog} />
        )}

        {showForkHistory && (
          <ForkHistoryDialog
            isOpen={showForkHistory}
            setIsOpen={setShowForkHistory}
          />
        )}
      </Section>
    </Card>
  );
}
