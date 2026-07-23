"use client";

import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { DropdownItem } from "@/app/data_types/general/dropdown";
import type { EaRefForks } from "@/app/data_types/ref_forks/ref_forks";
import { ValueTypes } from "@/app/data_types/values/value_types";
import {
  refforkSchema,
  type RefForkType,
} from "@/app/schemas/refforks/reffork_schema";
import { LabeledInput } from "@/components/app/LabeledInput";
import MovableDialog from "@/components/app/movable_dialog";
import ValueSelect from "@/components/app/value_select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

type RefforkDialogProps = {
  selectedRefFork: EaRefForks | null;
  isRefForkDialogOpen: boolean;
  setIsRefForkDialogOpen: (open: boolean) => void;
  refreshRefForks: (selectedRefForkId: number) => Promise<void>;
  closeRefForkDialog: () => void;
  title: string;
  mode: "create" | "edit";
};

async function saveRefFork(
  url: string,
  method: "POST" | "PUT",
  refFork: RefForkType,
): Promise<EaRefForks | null> {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(refFork),
    });

    if (!response.ok) return null;

    return (await response.json()) as EaRefForks;
  } catch {
    return null;
  }
}

function createRefFork(refFork: RefForkType) {
  return saveRefFork("/ref_forks/create_ref_fork", "POST", refFork);
}

function updateRefFork(refFork: RefForkType) {
  return saveRefFork("/ref_forks/update_ref_fork", "PUT", refFork);
}

async function getForkCategories(signal: AbortSignal) {
  const response = await fetch(
    `/values/get_values_label/${encodeURIComponent(ValueTypes.ea_forks_category)}`,
    { signal },
  );

  if (!response.ok) throw new Error("Fork categories could not be loaded");

  return (await response.json()) as DropdownItem[];
}

export default function RefforkDialog({
  selectedRefFork,
  isRefForkDialogOpen,
  setIsRefForkDialogOpen,
  refreshRefForks,
  closeRefForkDialog,
  title,
  mode,
}: RefforkDialogProps) {
  const [categories, setCategories] = useState<DropdownItem[]>([]);
  const dialogTitle = useMemo(
    () => `${mode === "create" ? "New" : "Edit"} ${title}`,
    [mode, title],
  );
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, isSubmitting },
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
    const controller = new AbortController();

    void getForkCategories(controller.signal)
      .then(setCategories)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        toast.error("Fork categories could not be loaded");
      });

    return () => controller.abort();
  }, []);

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

    if (selectedRefFork) {
      reset({
        uid_ref_fork: selectedRefFork.uid_ref_fork,
        category_fork: selectedRefFork.category_fork ?? "",
        fork_model: selectedRefFork.fork_model ?? "",
        notes: selectedRefFork.notes ?? "",
      });
    }
  }, [mode, selectedRefFork, reset]);

  const onSubmit = async (data: RefForkType) => {
    const response =
      mode === "create" ? await createRefFork(data) : await updateRefFork(data);

    if (!response?.uid_ref_fork) {
      toast.error("Error saving Reference Fork");
      return;
    }

    toast.success(
      mode === "create" ? "Reference Fork Created" : "Reference Fork Updated",
    );
    await refreshRefForks(response.uid_ref_fork);
    closeRefForkDialog();
  };

  return (
    <MovableDialog
      title={dialogTitle}
      open={isRefForkDialogOpen}
      setOpen={(open) => {
        setIsRefForkDialogOpen(open);
        if (!open) closeRefForkDialog();
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 p-4">
          <ValueSelect
            labelText="Select Fork Category"
            options={categories}
            onValueChange={(value) =>
              setValue("category_fork", value, { shouldDirty: true })
            }
          />
          <LabeledInput
            name="category_fork"
            label="Fork Category"
            control={control}
          />
          <LabeledInput
            name="fork_model"
            label="Fork Model"
            control={control}
          />
          <LabeledInput
            type="textarea"
            rows={4}
            name="notes"
            label="Notes"
            control={control}
          />
        </div>

        <DialogFooter className="h-12 py-2 px-4 bg-gray-200">
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeRefForkDialog}
            >
              Close
            </Button>
            <Button
              disabled={!isDirty || isSubmitting}
              variant="destructive"
              type="submit"
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </form>
    </MovableDialog>
  );
}
