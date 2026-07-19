"use client";

import OrderCustomerDialog from "@/app/dialogs/order/order_customer_dialog";
import { useOrderStore } from "@/app/stores/order/order_store";
import DisabledInput from "@/components/app/DisabledInput";
import LineRow from "@/components/app/LineRow";
import Section from "@/components/app/Section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";

export default function CustomerCard() {
  const [showDialog, setShowDialog] = useState(false);
  const { order } = useOrderStore();

  const openDialog = () => {
    setShowDialog(true);
  };

  const editAction = () => {
    return (
      <Button onClick={openDialog} size="sm">
        <FiEdit /> Edit
      </Button>
    );
  };

  return (
    <>
      <Card className="h-125">
        <Section no={1} title={"Customer"} actions={editAction()}>
          <div className="w-full flex flex-col gap-2">
            <LineRow className={"justify-between"}>
              <DisabledInput label={"Customer No"}>
                {order?.customer_no}
              </DisabledInput>
              <DisabledInput label={"Category"}>
                {order?.category}
              </DisabledInput>
            </LineRow>
            <DisabledInput label={"Adress"}>{order?.address}</DisabledInput>
            <DisabledInput label={"Invoice Adress"}>
              {order?.invoiceAddress}
            </DisabledInput>

            <LineRow className={"justify-between"}>
              <DisabledInput label={"Phone"}>
                {order?.customer_fon}
              </DisabledInput>
              <DisabledInput label={"Payment"}>
                {order?.bank_payment}
              </DisabledInput>
            </LineRow>

            <LineRow className={"justify-between"}>
              <DisabledInput label={"Vat no"}>
                {order?.vat_no_customer}
              </DisabledInput>
              <DisabledInput label={"Value tax?"}>
                {order?.no_vat === "0" ? "Yes" : "No"}
              </DisabledInput>
            </LineRow>
            <DisabledInput label={"Mail"}>{order?.mails}</DisabledInput>
          </div>
        </Section>
      </Card>
      <OrderCustomerDialog isOpen={showDialog} setIsOpen={setShowDialog} />
    </>
  );
}
