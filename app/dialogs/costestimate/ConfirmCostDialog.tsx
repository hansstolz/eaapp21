import { EaConfirmCost } from "@/app/data_types/costestimate/ea_cofirm_cost";
import { confirmSchema } from "@/app/schemas/costestimate/confirm_schema";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import {
  FormRadioGroup,
  FormRadioOption,
} from "@/components/app/form_radiogroup";
import { InputDate } from "@/components/app/inputdate";
import { LabeledInput } from "@/components/app/LabeledInput";
import MovableDialog from "@/components/app/movable_dialog";
import { PageColumns } from "@/components/app/TwoPageColumns";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useAuthStore } from "@/lib/stores/auth-store";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function ConfirmCostDialog({ isOpen, setIsOpen }: Props) {
  const { costestimate, updateCostestimate } = useCostestimateStore();
  const { user } = useAuthStore();

  const options: FormRadioOption[] = useMemo(
    () => [
      { uid: 0, label: "Mail", value: "0" },
      { uid: 1, label: "Phone", value: "1" },
      { uid: 2, label: "Other", value: "2" },
    ],
    [],
  );

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { isDirty },
  } = useForm<EaConfirmCost>({
    resolver: zodResolver(confirmSchema),
  });

  useEffect(() => {
    if (costestimate) {
      const conf: EaConfirmCost = {
        confirmed_how: costestimate.confirmed_how?.toString() ?? null,
        confirmed_by: costestimate.confirmed_by ?? user?.username ?? "Unknown",
        costestimate_confirm_check:
          costestimate.costestimate_confirm_check?.toString() ?? null,
        confirmed_when: costestimate.confirmed_when,
      };
      reset({ ...conf });
    }
  }, [costestimate, reset, user?.username]);

  const onSubmit = (data: EaConfirmCost) => {
    void updateCostestimate(data);
    setIsOpen(false);
  };
  return (
    <MovableDialog
      className="min-w-1/4"
      open={isOpen}
      setOpen={setIsOpen}
      title={`Confirm Costestimate ${costestimate?.costestimate_no}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="dialog-header rounded-t-lg">
          <div
            className={
              "flex flex-row justify-between text-xl font-semibold text-textcolor-light"
            }
          >
            Confirm Costestimate
          </div>
        </div>

        <div className="dialog-main bg-white">
          <PageColumns className="grid-cols-1">
            <div className="flex flex-col gap-3">
              <InputDate
                name="confirmed_when"
                control={control}
                label={"Date confirmed"}
              />
              <LabeledInput
                type="text"
                name={"confirmed_by"}
                label={"Confirmed by"}
                control={control}
                width="w-full"
              />

              <FormRadioGroup
                onValueChange={(value) => {
                  if (value === "0") {
                    setValue("confirmed_how", null);
                  }
                }}
                className="text-sm"
                name={"costestimate_confirm_check"}
                label={"Is confirmed?"}
                control={control}
                options={[
                  { value: "1", label: "Yes" },
                  { value: "0", label: "No" },
                ]}
              />

              <FormRadioGroup
                className="text-sm"
                label="Confirmed how?"
                name="confirmed_how"
                control={control}
                options={options}
              />
            </div>
          </PageColumns>
        </div>

        <DialogFooter className="h-12 py-2 px-4 bg-gray-200">
          <div className="flex gap-12 justify-end mr-4">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close
            </Button>
            <Button disabled={!isDirty} type="submit" size="sm" title={"Save"}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </form>
    </MovableDialog>
  );
}
