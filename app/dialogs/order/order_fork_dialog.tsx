"use client";
import {
  _getForkById,
  _getForkReferences,
  _updateForkOrder,
} from "@/app/api/forks/forks_crud";
import { RefTypes } from "@/app/data_types/forks/ref_types";
import {
  EaForkDialog,
  forkSchemaDialog,
} from "@/app/schemas/order/fork_schema_dialog";
import { useOrderStore } from "@/app/stores/order/order_store";
import { _updateOrderFork } from "@/app/api/orders/orders_crud";
import DisabledInput from "@/components/app/DisabledInput";
import { DropdownMenuItems } from "@/components/app/dropdown_menu";
import { InputDate } from "@/components/app/inputdate";
import { LabeledInput } from "@/components/app/LabeledInput";
import MovableDialog from "@/components/app/movable_dialog";
import { PageColumns } from "@/components/app/TwoPageColumns";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import useAutoFocus from "@/lib/hooks/autofocus";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function OrderForkDialog({ isOpen, setIsOpen }: Props) {
  const [refs, setRefs] = useState<RefTypes | null>(null);
  const { order, updateOrder } = useOrderStore();
  const firstInput = useAutoFocus();

  const {
    handleSubmit: handleSubmitForkDialog,
    reset,
    control,
    setValue,
    getValues,
    formState: { isDirty },
  } = useForm<EaForkDialog>({
    resolver: zodResolver(forkSchemaDialog),
  });

  useEffect(() => {
    const getFork = async () => {
      if (order) {
        const result = await _getForkById(order.uid_fork!);
        const references = await _getForkReferences();

        if (result) {
          const fork_in_date = new Date(order.fork_in_date);
          const fork_in_carrier = order.fork_in_carrier;
          const fork: EaForkDialog = {
            fork_in_date,
            fork_in_carrier,
            uid_fork: result.fork.uid_fork,
            client_name: result.fork.client_name,
            fork_model: result.fork.fork_model,
            fork_no: result.fork.fork_no,
            colour: result.fork.colour,
            wheelsize: result.fork.wheelsize,
            category_fork: result.fork.category_fork,
          };

          const refs: RefTypes = {
            parts: result.parts,
            refCategories: references.ref_categories,
            refColors: references.ref_colors,
            refForks: references.ref_forks,
            refWheelsizes: references.ref_wheelsizes,
          };
          setRefs(refs);
          reset(fork);
        }
      }
    };

    void getFork();
  }, [order, reset]);

  const submitFork = async (inData: EaForkDialog) => {
    const fork = await _updateForkOrder(inData);

    if (order && fork) {
      order.updateFork(inData);
      await _updateOrderFork(order.orderForkUpdate);
      updateOrder();
      toast.success("Fork updated successfully");
      setIsOpen(false);
    }
  };
  return (
    <>
      <MovableDialog
        className="min-w-2/5"
        open={isOpen}
        setOpen={setIsOpen}
        title={"Edit Fork"}
      >
        <form onSubmit={handleSubmitForkDialog(submitFork)}>
          <div className="dialog-main bg-white">
            <PageColumns className="grid-cols-2">
              <div className="flex flex-col gap-3">
                <InputDate
                  name="fork_in_date"
                  control={control}
                  label={"Fork in"}
                  className={"w-30"}
                />
                <DisabledInput label={"Fork No"}>
                  {getValues("fork_no")}
                </DisabledInput>
              </div>
              <div className="flex flex-col gap-3">
                <LabeledInput
                  control={control}
                  name={"fork_in_carrier"}
                  label={"carrier"}
                />
                <DisabledInput label={"Fork id"}>
                  {getValues("fork_no")}
                </DisabledInput>
              </div>

              <div className="flex flex-col gap-3">
                <LabeledInput
                  ref={firstInput}
                  name={"fork_model"}
                  label={"Fork model"}
                  control={control}
                />
                <LabeledInput
                  name={"category_fork"}
                  label={"category"}
                  control={control}
                />

                <LabeledInput
                  name={"colour"}
                  label={"color"}
                  control={control}
                />
                <LabeledInput
                  name={"wheelsize"}
                  label={"wheelsize"}
                  control={control}
                />
                <LabeledInput
                  name={"client_name"}
                  label={"client name"}
                  control={control}
                />
              </div>
              <div className="flex flex-col gap-10 mt-6">
                <DropdownMenuItems
                  onSelect={(menus) =>
                    setValue("fork_model", menus.label as string, {
                      shouldDirty: true,
                    })
                  }
                  items={refs?.refForks ?? []}
                  title="RefFork"
                />

                <DropdownMenuItems
                  onSelect={(menus) =>
                    setValue("category_fork", menus.value as string, {
                      shouldDirty: true,
                    })
                  }
                  items={refs?.refCategories ?? []}
                  title="Ref-Categories"
                />
                <DropdownMenuItems
                  onSelect={(menus) =>
                    setValue("colour", menus.value as string, {
                      shouldDirty: true,
                    })
                  }
                  items={refs?.refColors ?? []}
                  title="Ref-Color"
                />
                <DropdownMenuItems
                  onSelect={(menus) =>
                    setValue("wheelsize", menus.value as string, {
                      shouldDirty: true,
                    })
                  }
                  items={refs?.refWheelsizes ?? []}
                  title="Ref-Wheelsizes"
                />
              </div>
            </PageColumns>
          </div>
          <DialogFooter className="h-12 py-2 px-4 bg-gray-200">
            <div className="flex gap-12 justify-end mr-4">
              <Button
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Close
              </Button>
              <Button disabled={!isDirty} type="submit" size="sm">
                Save
              </Button>
            </div>
          </DialogFooter>
        </form>
      </MovableDialog>
    </>
  );
}
