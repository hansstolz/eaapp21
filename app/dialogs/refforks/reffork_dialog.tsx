"use client";

import React, { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { _createRefforks, _updateReffork } from "@/app/api/refforks/crud";

import ValueSelect from "@/components/general/value_select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { LabeledInput } from "@/components/ui/LabeledInput";

import { refforkSchema, RefForkType } from "@/schemas/refforks/reffork_schema";
import { useShallow } from "zustand/react/shallow";
import { useForm } from "react-hook-form";
import {
  useRefForkStore,
  useSelectedRefFork,
} from "@/lib/stores/refforks/ref_forks_store";
import MovableDialog from "@/components/ui/movable_dialog";

export default function RefforkDialog({ title }: { title: string }) {
  const selectedRefFork = useSelectedRefFork();

  const {
    categories,
    loadCategories,
    loadInitialData,
    mode,
    isRefForkDialogOpen,
    closeRefForkDialog,
  } = useRefForkStore(
    useShallow((s) => ({
      categories: s.categories,
      loadCategories: s.loadCategories,
      loadInitialData: s.loadInitialData,
      mode: s.mode,
      isRefForkDialogOpen: s.isRefForkDialogOpen,
      closeRefForkDialog: s.closeRefForkDialog,
    })),
  );

  const dialogTitle = useMemo(() => {
    if (mode === "create") return `New ${title}`;
    if (mode === "edit") return `Edit ${title}`;
    return title;
  }, [mode, title]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm<RefForkType>({
    resolver: zodResolver(refforkSchema),
    defaultValues: {
      uid_ref_fork: 0,
      category_fork: "",
      fork_model: "",
      notes: "",
    },
  });

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (mode === "create") {
      reset({
        uid_ref_fork: 0,
        category_fork: "",
        fork_model: "",
        notes: "",
      });
      return;
    }

    if (mode === "edit" && selectedRefFork) {
      reset({
        uid_ref_fork: selectedRefFork.uid_ref_fork,
        category_fork: selectedRefFork.category_fork ?? "",
        fork_model: selectedRefFork.fork_model ?? "",
        notes: selectedRefFork.notes ?? "",
      });
    }
  }, [mode, selectedRefFork, reset]);

  const addForkCategory = (value: string) => {
    setValue("category_fork", value, { shouldDirty: true });
  };

  const onSubmit = async (data: RefForkType) => {
    if (mode === "create") await _createRefforks(data);
    else if (mode === "edit") await _updateReffork(data);

    await loadInitialData();
    closeRefForkDialog();
  };

  return (
    <MovableDialog
      title={dialogTitle}
      open={isRefForkDialogOpen}
      setOpen={(open) => {
        if (!open) closeRefForkDialog();
      }}
      isDirty={isDirty}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <ValueSelect
            labelText={"Select Fork Category"}
            options={categories}
            onValueChange={addForkCategory}
          />

          <LabeledInput
            name={"category_fork"}
            label={"Fork Category"}
            control={control}
          />

          <LabeledInput
            name={"fork_model"}
            label={"Fork Model"}
            control={control}
          />

          <LabeledInput
            type="textarea"
            name={"notes"}
            label={"Notes"}
            control={control}
          />
        </div>

        <DialogFooter className="h-12 p-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={closeRefForkDialog}
            >
              Close
            </Button>
            <Button disabled={!isDirty} variant="destructive" type="submit">
              Save
            </Button>
          </div>
        </DialogFooter>
      </form>
    </MovableDialog>
  );
}
