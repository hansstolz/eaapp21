"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import LabeledInfo from "@/components/app/labeled_info";
import ValueSelect from "@/components/app/value_select";
import MovableDialog from "@/components/app/movable_dialog";
import { LabeledInput } from "@/components/app/LabeledInput";
import { EaRefForks, ForkFeature } from "@/app/data_types/ref_forks/ref_forks";
import { FormSwitch } from "@/components/app/form_switch";
import {
  featureSchema,
  FeatureType,
} from "@/app/schemas/refforks/feature_schema";
import type { DropdownItem } from "@/app/data_types/general/dropdown";
import { ValueTypes } from "@/app/data_types/values/value_types";

type ForkFeatureDialogProps = {
  selectedRefFork: EaRefForks | null;
  selectedForkFeature: ForkFeature | null;
  selectedRefForkId: number | null;
  isForkFeatureDialogOpen: boolean;
  setIsForkFeatureDialogOpen: (open: boolean) => void;
  selectRefFork: (uid_ref_fork: number) => Promise<void>;
  closeForkFeatureDialog: () => void;
  title: string;
  mode: "create" | "edit";
};

async function saveForkFeature(
  url: string,
  method: "POST" | "PUT",
  feature: FeatureType,
): Promise<ForkFeature | null> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feature),
    });

    if (!response.ok) return null;

    return (await response.json()) as ForkFeature;
  } catch {
    return null;
  }
}

function _createForkFeature(feature: FeatureType) {
  return saveForkFeature("/ref_parts/create_ref_part", "POST", feature);
}

function _updateForkFeature(feature: FeatureType) {
  return saveForkFeature("/ref_parts/update_ref_part", "PUT", feature);
}

async function getValuesLabel(
  type: ValueTypes,
  signal: AbortSignal,
): Promise<DropdownItem[]> {
  const response = await fetch(
    `/values/get_values_label/${encodeURIComponent(type)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("Article categories could not be loaded");
  }

  return (await response.json()) as DropdownItem[];
}

export default function ForkFeatureDialog({
  selectedRefFork,
  selectedForkFeature,
  isForkFeatureDialogOpen,
  selectedRefForkId,
  setIsForkFeatureDialogOpen,
  selectRefFork,
  closeForkFeatureDialog,
  title,
  mode,
}: ForkFeatureDialogProps) {
  const [categories, setCategories] = useState<DropdownItem[]>([]);
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
  } = useForm({
    resolver: zodResolver(featureSchema),
  });

  // Kategorien einmal laden
  useEffect(() => {
    const controller = new AbortController();

    async function loadArticleCategories() {
      try {
        const values = await getValuesLabel(
          ValueTypes.ea_forks_category,
          controller.signal,
        );
        setCategories(values);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        toast.error("Article categories could not be loaded");
      }
    }

    void loadArticleCategories();

    return () => controller.abort();
  }, []);

  // Form-Reset abhängig von mode + selection
  useEffect(() => {
    // Create: leeres Formular, aber uid_ref_fork aus aktueller Selection setzen
    if (mode === "create") {
      reset({
        uid_ref_part: 0,
        uid_ref_fork: selectedRefFork?.uid_ref_fork ?? 0,
        ref_part_name: "",
        ref_part_qualitiy: "",
        ref_part_notes: "",
        check_character_int: 0,
      });
      return;
    }

    // Edit: Feature laden
    if (mode === "edit" && selectedForkFeature && selectedRefFork) {
      reset({
        uid_ref_part: selectedForkFeature.uid_ref_part ?? 0,
        uid_ref_fork: selectedRefFork.uid_ref_fork,
        ref_part_name: selectedForkFeature.ref_part_name ?? "",
        ref_part_qualitiy: selectedForkFeature.ref_part_qualitiy ?? "",
        ref_part_notes: selectedForkFeature.ref_part_notes ?? "",
        check_character_int: selectedForkFeature.check_character_int ?? 0,
      });
    }
  }, [mode, selectedForkFeature, selectedRefFork, reset]);

  const addArticleCategory = (value: string) => {
    setValue("ref_part_qualitiy", value, { shouldDirty: true });
  };

  const onSubmit = async (val: FeatureType) => {
    const uid_ref_fork = selectedRefFork?.uid_ref_fork ?? 0;
    if (!uid_ref_fork) {
      toast.error("No Reference Fork selected");
      return;
    }

    // Immer den aktuellen Fork setzen (wichtig bei create)
    val.uid_ref_fork = uid_ref_fork;

    const response: ForkFeature | null =
      mode === "create"
        ? await _createForkFeature(val)
        : await _updateForkFeature(val);

    if (!response?.uid_ref_part) {
      toast.error("Error saving Fork Feature");
      return;
    }

    toast.success(
      mode === "create" ? "Fork Feature Created" : "Fork Feature Updated",
    );

    // reload Features + Articles für den aktuell selektierten Fork
    if (selectedRefForkId) {
      await selectRefFork(selectedRefForkId);
    } else {
      await selectRefFork(uid_ref_fork);
    }

    closeForkFeatureDialog();
  };

  return (
    <MovableDialog
      title={dialogTitle}
      open={isForkFeatureDialogOpen}
      setOpen={(open) => {
        setIsForkFeatureDialogOpen(open);
        if (!open) closeForkFeatureDialog();
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 p-4">
          <LabeledInfo label={"Fork Category"}>
            {selectedRefFork?.category_fork ?? ""}
          </LabeledInfo>
          <LabeledInfo label={"Fork Model"}>
            {selectedRefFork?.fork_model ?? ""}
          </LabeledInfo>

          <ValueSelect
            labelText={"Select Article Category"}
            options={categories}
            onValueChange={addArticleCategory}
          />

          <LabeledInput
            name="ref_part_name"
            label={"Ref Part Name"}
            control={control}
          />

          <FormSwitch
            name="check_character_int"
            label="Check Character Int"
            control={control}
          />

          <LabeledInput
            type="textarea"
            rows={4}
            name="ref_part_qualitiy"
            label={"Ref Part Quality"}
            control={control}
          />

          <LabeledInput
            type="textarea"
            rows={4}
            name="ref_part_notes"
            label={"Notes"}
            control={control}
          />
        </div>

        <DialogFooter className="h-12 py-2 px-4 bg-gray-200">
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeForkFeatureDialog}
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
