"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import useAutoFocus from "@/lib/hooks/autofocus";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { valueSchema } from "@/app/schemas/values/value_schema";
import MovableDialog from "@/components/app/movable_dialog";
import { LabeledInput } from "@/components/app/LabeledInput";
import { EaValues } from "@/app/data_types/user/ea_values";
import {
  useSelectedValue,
  useValueStore,
} from "@/app/stores/values/value_store";

type Props = {
  title: string;
};

export default function ValueDialog(props: Props) {
  const { title } = props;
  const firstInput = useAutoFocus();
  const selectedValue = useSelectedValue();
  const selectedType = useValueStore((state) => state.selectedType);
  const showDialog = useValueStore((state) => state.showDialog);
  const mode = useValueStore((state) => state.mode);
  const openCreate = useValueStore((state) => state.openCreate);
  const setShowDialog = useValueStore((state) => state.setShowDialog);
  const closeDialog = useValueStore((state) => state.closeDialog);
  const submitData = useValueStore((state) => state.submitData);

  const form = useForm({
    resolver: zodResolver(valueSchema),
  });

  const { isDirty } = form.formState;

  useEffect(() => {
    form.reset({
      uid_value: selectedValue ? selectedValue.uid_value : 0,
      type: selectedValue ? selectedValue.type : selectedType,
      value: selectedValue ? selectedValue.value : "",
      value_two: selectedValue ? selectedValue.value_two : "",
    });
  }, [showDialog, selectedType, selectedValue, form]);

  const getTitle = () => {
    return mode === "create" ? `New ${title}` : `Edit ${title}`;
  };

  async function onSubmit(data: z.infer<typeof valueSchema>) {
    if (!isDirty) {
      return;
    }
    await submitData(data as EaValues);
  }

  return (
    <>
      <Button
        onClick={() => {
          openCreate();
        }}
        className="ml-3 px-3 w-fit"
      >
        New Item
      </Button>

      <MovableDialog
        title={getTitle()}
        open={showDialog}
        setOpen={(open) => {
          if (open) {
            setShowDialog(true);
          } else {
            closeDialog();
          }
        }}
        isDirty={isDirty}
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 mb-3">
            <LabeledInput
              ref={firstInput}
              name={"value"}
              label={"value"}
              control={form.control}
            />
            <LabeledInput
              name={"value_two"}
              label={"value two"}
              control={form.control}
            />
          </div>
          <DialogFooter className="h-12 p-4 ">
            <div className=" flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => closeDialog()}
              >
                Close
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </DialogFooter>
        </form>
      </MovableDialog>
    </>
  );
}
