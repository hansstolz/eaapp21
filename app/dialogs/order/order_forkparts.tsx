import DisabledInput from "@/components/app/DisabledInput";
import { DropdownMenuItems } from "@/components/app/dropdown_menu";
import { PageColumns } from "@/components/app/TwoPageColumns";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { LabeledInput } from "@/components/app/LabeledInput";
import MovableDialog from "@/components/app/movable_dialog";
import { DropdownItem } from "@/app/data_types/general/dropdown";
import {
  EaForksParts,
  EaRefForksAndParts,
} from "@/app/data_types/orders/ea_forks_parts";
import useAutoFocus from "@/lib/hooks/autofocus";
import { useForkPartsStore } from "@/app/stores/order/fp_store";
import { useOrderStore } from "@/app/stores/order/order_store";
import {
  EaForksPartsNew,
  forkPartSchema,
} from "@/app/schemas/order/fork_part_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function ForkPartDialog({ isOpen, setIsOpen }: Props) {
  const firstInput = useAutoFocus();
  const { order } = useOrderStore();
  const addForkPart = useForkPartsStore((state) => state.addForkPart);
  const updateForkPart = useForkPartsStore((state) => state.updateForkPart);
  const [refFork, setRefFork] = useState<EaRefForksAndParts | null>(null);
  const forkPart = useForkPartsStore((state) => state.forkPart);
  const itemOf = useForkPartsStore((state) => state.itemOf);
  const newRec = useForkPartsStore((state) => state.newRec);
  const setNewRec = useForkPartsStore((state) => state.setNewRec);

  const {
    control,
    handleSubmit,
    reset,
    setValue,

    formState: { errors, isDirty },
  } = useForm<EaForksPartsNew>({
    resolver: zodResolver(forkPartSchema),
    defaultValues: {
      forks_part_quality: "",
      forks_part_name: "",
    },
  });

  const newForkPart = () => {
    if (order) {
      const newItem: EaForksPartsNew = {
        forks_part_quality: "",
        forks_part_name: "",
      };
      reset(newItem);
    }
  };

  const showForkPart = () => {
    const updateItem: EaForksPartsNew = {
      forks_part_quality: forkPart?.forks_part_quality ?? "",
      forks_part_name: forkPart?.forks_part_name ?? "",
    };
    reset(updateItem);
  };

  useEffect(() => {
    newRec === true && newForkPart();
  }, [newRec]);

  useEffect(() => {
    newRec === false && showForkPart();
  }, [forkPart]);

  useEffect(() => {
    const getRefFork = async () => {
      const response = await fetch(
        `/ref_forks/get_ref_fork/${order?.uid_ref_fork ?? -1}`,
      );
      if (response.ok) setRefFork(await response.json());
    };

    void getRefFork();
  }, [order]);

  const updatePartname = (value: DropdownItem) => {
    setValue("forks_part_name", value.label, { shouldDirty: true });
  };

  const addNewForkPart = (part: EaForksParts) => {
    addForkPart(part);
    setNewRec(true);
    newForkPart();
  };

  const submitPart = async (data: EaForksPartsNew) => {
    if (order) {
      const part: EaForksParts = {
        uid_forks_part: newRec ? 0 : (forkPart?.uid_forks_part ?? 0),
        uid_fork: order.uid_fork,
        uid_ref_fork: order.uid_ref_fork,
        forks_part_name: data.forks_part_name,
        forks_part_quality: data.forks_part_quality ?? "",
        check_sort: 0,
        forks_part_notes: "",
        category_fork: refFork?.category_fork ?? "",
        check_selection: 0,
        created_at: null,
        updated_at: null,
      };

      newRec ? addForkPart(part) : updateForkPart(part);
    }
  };

  const saveEdited = (data: EaForksPartsNew) => {
    submitPart(data);
    setNewRec(false);
  };

  const onSubmit = (data: EaForksPartsNew) => {
    if (!isDirty) return;
    const part: EaForksParts = {
      uid_forks_part: newRec ? 0 : (forkPart?.uid_forks_part ?? 0),
      uid_fork: order?.uid_fork ?? 0,
      uid_ref_fork: order?.uid_ref_fork ?? 0,
      forks_part_name: data.forks_part_name,
      forks_part_quality: data.forks_part_quality ?? "",
      check_sort: 0,
      forks_part_notes: "",
      category_fork: refFork?.category_fork ?? "",
      check_selection: 0,
      created_at: null,
      updated_at: null,
    };

    newRec ? addNewForkPart(part) : saveEdited(data);
  };

  const getHeader = () => {
    return (
      <DialogTitle className="flex flex-col text-primary-foreground">
        <div className="flex flex-row items-center justify-between">
          <div>Fork Part {newRec ? "New" : "Edit"}</div>
          <span>{itemOf}</span>
        </div>
      </DialogTitle>
    );
  };
  return (
    <MovableDialog
      className="min-w-3/5"
      open={isOpen}
      setOpen={setIsOpen}
      title=""
      header={getHeader()}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="dialog-main bg-white">
          <PageColumns className="grid-cols-2">
            <div className="flex flex-col gap-3">
              <DisabledInput label={"Category"}>
                {refFork?.category_fork}
              </DisabledInput>
              <LabeledInput
                ref={firstInput}
                name={"forks_part_name"}
                label={"Partname"}
                control={control}
                width="w-full"
              />
            </div>
            <div className="flex flex-col gap-3">
              <DisabledInput label={"Fork Model"}>
                {refFork?.fork_model}
              </DisabledInput>
              <div className="h-2"></div>
              <DropdownMenuItems
                items={refFork?.fork_parts ?? []}
                title="Parts"
                onSelect={updatePartname}
              />
            </div>
            <LabeledInput
              type="textarea"
              rows={4}
              control={control}
              name={"forks_part_quality"}
              label={"Part Quality"}
              width="w-full"
            />
          </PageColumns>
        </div>

        <DialogFooter className="h-12 py-2 px-4 bg-gray-200">
          <div className="flex gap-2 justify-end mr-4">
            <Button
              size="sm"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close
            </Button>
            <Button disabled={!isDirty} type="submit" size="sm">
              {newRec ? "New" : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </MovableDialog>
  );
}
