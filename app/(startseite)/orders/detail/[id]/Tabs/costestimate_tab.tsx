"use client";

import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import HLine from "@/components/app/hline";
import { InputDate } from "@/components/app/inputdate";
import { LabeledInput } from "@/components/app/LabeledInput";
import SelectValues from "@/components/app/select_values";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEuroSign, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { FiCalendar, FiMail, FiPlus, FiPrinter } from "react-icons/fi";
import OrderPositions from "./costestimate/order_positions";
import ConfirmCostDialog from "@/app/dialogs/costestimate/ConfirmCostDialog";
import AddCostDialog from "@/app/dialogs/costestimate/add_costestimate";
import { useOrderStore } from "@/app/stores/order/order_store";
import type { EaCostestimate } from "@/app/data_types/costestimate/ea_costestimate";

export default function CostestimateTab() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { order } = useOrderStore();
  const {
    costestimate,
    costestimates,
    isConfirmed,
    getCostestimate,
    getCostestimatesNumbers,
    saveCostestimate,
  } = useCostestimateStore();
  const firstCostestimateUid = costestimates[0]?.value;
  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm<EaCostestimate>();

  useEffect(() => {
    if (costestimate) reset(costestimate);
  }, [costestimate, reset]);

  useEffect(() => {
    if (order) void getCostestimatesNumbers(order.uid_order);
  }, [getCostestimatesNumbers, order]);

  useEffect(() => {
    if (firstCostestimateUid) {
      void getCostestimate(Number(firstCostestimateUid));
    }
  }, [firstCostestimateUid, getCostestimate]);

  const submitData = async (data: EaCostestimate) => {
    await saveCostestimate(data);
  };
  const copyToCal = () => {
    // Logic to copy diagnosis data to calendar
  };

  const showPrintDialog = () => {
    // Logic to show print dialog
  };

  return (
    <>
      <div className={"mb-8 mt-4"}>
        <form onSubmit={handleSubmit(submitData)}>
          <div className="flex gap-2 text-md text-blue-800  mb-4 font-medium">
            <div className="w-full bg-blue-50 border-solid border border-blue-300 rounded-md flex flex-row justify-between p-2 ">
              <div className="flex flex-row gap-1 items-center">
                <FaEuroSign />
                <div>Costestimate</div>
              </div>
              <div className="flex flex-row gap-3">
                <Button disabled={!isDirty} type="submit" size="sm">
                  Save
                </Button>

                <Button type="button" size="sm" onClick={showPrintDialog}>
                  <FiMail />
                  Mail
                </Button>
                <Button type="button" size="sm" onClick={showPrintDialog}>
                  <FiPrinter />
                  Print
                </Button>

                <Button type="button" onClick={copyToCal} size="sm">
                  <FiCalendar /> Cal
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-3 items-center">
              <SelectValues
                className="text-sm"
                label="Costestimates"
                disabled={isConfirmed}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  getCostestimate(Number(e.target.value))
                }
                options={costestimates}
                defaultValue={firstCostestimateUid}
                id={"costestimates"}
              />

              <Button
                type="button"
                disabled={isConfirmed}
                onClick={() => {
                  setShowAddDialog(true);
                }}
                className="mt-8"
                size="sm"
              >
                <FiPlus /> Add Costestimate
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowConfirmDialog(true);
                }}
                className="mt-8"
                size="sm"
              >
                {isConfirmed ? <FaThumbsUp /> : <FaThumbsDown />}
                {isConfirmed ? "Confirmed" : "Confirm"}
              </Button>
            </div>
            <div className="flex flex-row gap-3">
              <LabeledInput
                className="text-xs"
                name={"worker_costestimate"}
                label={"Worker"}
                control={control}
              />
              <InputDate
                name="costestimate_date"
                control={control}
                label={"Workdate"}
                className={"w-1/2"}
                classLabel="text-xs"
              />
            </div>
          </div>
          <HLine />
          <OrderPositions />
        </form>
      </div>
      {showConfirmDialog && (
        <ConfirmCostDialog
          isOpen={showConfirmDialog}
          setIsOpen={setShowConfirmDialog}
        />
      )}
      {showAddDialog && (
        <AddCostDialog isOpen={showAddDialog} setIsOpen={setShowAddDialog} />
      )}
    </>
  );
}
