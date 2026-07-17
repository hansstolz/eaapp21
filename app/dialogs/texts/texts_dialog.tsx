"use client";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import useAutoFocus from "@/lib/hooks/autofocus";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useSelectedText, useTextStore } from "@/app/stores/texts/text_store";
import { textSchema } from "@/app/schemas/textSchema";
import MovableDialog from "@/components/app/movable_dialog";
import { LabeledInput } from "@/components/app/LabeledInput";

type Props = {
  title: string;
  buttonClassName?: string;
};

export default function TextsDialog(props: Props) {
  const { title, buttonClassName } = props;
  const firstInput = useAutoFocus();
  const selectedText = useSelectedText();
  const { showDialog, setShowDialog, mode, submitData, selectText } =
    useTextStore(
      useShallow((s) => ({
        showDialog: s.showDialog,
        setShowDialog: s.setShowDialog,
        submitData: s.submitData,
        mode: s.mode,
        selectText: s.selectText,
      })),
    );

  const form = useForm({
    resolver: zodResolver(textSchema),
  });

  const { isDirty } = form.formState;

  const resetForm = () => {
    form.reset({
      uid_text: selectedText?.uid_text ?? 0,
      text_code: selectedText?.text_code ?? "",
      text_value: selectedText?.text_value ?? "",
      text_no: selectedText?.text_no ?? 0,
    });
  };

  useEffect(() => {
    resetForm();
  }, [selectedText]);

  const getTitle = () => {
    return mode === "create" ? `New ${title}` : `Edit ${title}`;
  };

  async function onSubmit(data: z.infer<typeof textSchema>) {
    if (!isDirty) {
      return;
    }
    const success = await submitData(data);
    if (success) {
      form.reset();
    }
  }

  return (
    <>
      <div>
        <Button
          onClick={() => {
            selectText(undefined);
            setShowDialog(true);
          }}
          className={cn("px-3 w-fit", buttonClassName)}
        >
          New Item
        </Button>
      </div>
      <MovableDialog
        title={getTitle()}
        open={showDialog}
        setOpen={setShowDialog}
        isDirty={isDirty}
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className=" flex flex-col gap-4 mb-3">
            <LabeledInput
              ref={firstInput}
              name={"text_code"}
              label={"Text Code"}
              control={form.control}
            />
            <LabeledInput
              type="textarea"
              rows={12}
              name={"text_value"}
              label={"Text Value"}
              control={form.control}
            />
          </div>
          <DialogFooter className="h-12 p-4 ">
            <div className=" flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
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
