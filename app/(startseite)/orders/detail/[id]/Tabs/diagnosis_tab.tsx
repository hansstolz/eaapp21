import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaStethoscope } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import "./diagnosis.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useOrderStore } from "@/app/stores/order/order_store";
import { useDiagnosisStore } from "@/app/stores/diagnosis/diagnosis_store";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import { useWarrantyStore } from "@/app/stores/warranty/warranty_store";
import {
  diagnosisSchema,
  DiagnosisType,
} from "@/app/schemas/diagnosis/DiagnosisSchema";
import copyToClipboard from "@/lib/hooks/useCopy";
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/app/LabeledInput";
import { InputDate } from "@/components/app/inputdate";
import TwoColumn from "@/components/app/TwoColumn";
import { DropdownMenuItems } from "@/components/app/dropdown_menu";
import { PageColumns } from "@/components/app/TwoPageColumns";
import SelectValues from "@/components/app/select_values";
import { FormCheckboxGroup } from "@/components/app/form_checkbox";
import HLine from "@/components/app/hline";
import { FormRadioGroup } from "@/components/app/form_radiogroup";
import { DropdownItem } from "@/components/app/DropDown";
import { DiagnoseValues } from "@/app/data_types/diagnosis/diagnose_values";

export default function DiagnosisTab() {
  const { order } = useOrderStore();
  const { diagnosis, values, uses, settings, submitDiagnosis } =
    useDiagnosisStore();
  const {
    costestimates,
    isConfirmed,
    getCostestimate,
    getCostestimatesNumbers,
    getConfirmedCostestimate,
  } = useCostestimateStore();
  const { warranty, onWarrantyRequestChange, updateWarrantyReason } =
    useWarrantyStore();

  const {
    handleSubmit,
    reset,
    control,
    setValue,

    formState: { isDirty },
  } = useForm<DiagnosisType>({
    resolver: zodResolver(diagnosisSchema),
  });

  const dirty = React.useRef(false);

  useEffect(() => {
    dirty.current = isDirty;
  }, [isDirty]);

  const firstCostestimateUid = costestimates[0]?.uid;

  useEffect(() => {
    if (order) {
      getCostestimatesNumbers(order.uid_order);
      getConfirmedCostestimate(order.uid_order);
    }
  }, [order, getCostestimatesNumbers, getConfirmedCostestimate]);

  useEffect(() => {
    if (firstCostestimateUid) {
      getCostestimate(Number(firstCostestimateUid));
    }
  }, [firstCostestimateUid, getCostestimate]);

  useEffect(() => {
    if (diagnosis && warranty) {
      reset({
        ...diagnosis,
        fork_invoice_date: diagnosis.fork_invoice_date,
        work_diagnosis_date: diagnosis.work_diagnosis_date,
        diagnosis_date: diagnosis.diagnosis_date,
        uses,
        settings,
        warranty_request: warranty.warranty_request,
        warranty_reason: warranty.warranty_reason,
      });
    }
  }, [diagnosis, reset, settings, uses, warranty]);

  const valHandler = (value: DiagnoseValues, item: DropdownItem) => {
    setValue(value, item.label, { shouldDirty: true });
  };

  const getInfoDiagnosis = () => {
    if (!order || !diagnosis) return "";
    return `${order.getNameCustNo()}\nDiagonosis: #${
      diagnosis.diagnosis_no
    }\n${order.getForkModelColor()}`;
  };

  const copyToCal = async () => {
    const ok = await copyToClipboard({ copyMe: getInfoDiagnosis() });
    if (ok) toast.success("Diagnosis info copied to clipboard!");
    else toast.error("Failed to copy diagnosis info to clipboard.");
  };

  const submitData = useCallback(async (data: DiagnosisType) => {
    const { warranty_reason } = data;
    await Promise.all([
      submitDiagnosis(data),
      updateWarrantyReason(warranty_reason || ""),
    ]);
  }, [submitDiagnosis, updateWarrantyReason]);

  useEffect(() => {
    const submitOnLeave = async () => {
      await handleSubmit(submitData)();
    };
    return () => {
      if (dirty.current) void submitOnLeave();
    };
  }, [handleSubmit, submitData]);

  return (
    <>
      <div className={"mb-8 mt-4"}>
        <form onSubmit={handleSubmit(submitData)}>
          <div className="flex gap-2 text-md text-blue-800  mb-4 font-medium">
            <div className="w-full bg-blue-50 border-solid border border-blue-300 rounded-md flex flex-row justify-between p-2 ">
              <div className="flex flex-row gap-1 items-center">
                <FaStethoscope />
                <div>Diagnosis</div>
              </div>
              <div className="flex flex-row gap-3">
                <Button disabled={!isDirty} type="submit" size="sm">
                  Save
                </Button>
                <Button type="button" onClick={copyToCal} size="sm">
                  <FiCalendar /> Cal
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <SelectValues
              className="text-sm"
              label="Costestimates"
              disabled={isConfirmed}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                getCostestimate(Number(e.target.value))
              }
              options={costestimates}
              id={"costestimates"}
            />
            <div className="flex flex-row gap-3">
              <LabeledInput
                className="text-xs"
                name={"worker_diagnosis"}
                label={"Worker"}
                control={control}
              />
              <InputDate
                name="work_diagnosis_date"
                control={control}
                label={"Workdate"}
                className={"text-xs w-1/2"}
              />
            </div>
          </div>
          <div className="diagnosis-grid mt-8 gap-3">
            <div className="col1 flex flex-col gap-6">
              <FormRadioGroup
                name={"warranty_request"}
                label={"Warranty"}
                control={control}
                onValueChange={onWarrantyRequestChange}
                options={[
                  { value: "accept", label: "accept" },
                  { value: "no warranty", label: "no warranty" },
                ]}
              />

              <InputDate
                name="fork_invoice_date"
                control={control}
                label={"fork invoice date"}
              />
            </div>
            <div className="col2 flex flex-col  gap-6">
              <LabeledInput
                name={"customer_height"}
                label={"Height Cust Client"}
                control={control}
              />
              <div className="h-50 py-2 overflow-scroll border border-gray-500 rounded-md px-4">
                <FormCheckboxGroup
                  label={"use for"}
                  control={control}
                  name={"uses"}
                  options={values?.forks_use ?? []}
                />
              </div>
            </div>
            <div className="col3 flex flex-col  gap-6">
              <LabeledInput
                width="w-1/2"
                name={"customer_weight"}
                label={"Weight Cust Client"}
                control={control}
              />
              <div className="h-50 py-2 overflow-scroll border border-gray-500 rounded-md px-4">
                <FormCheckboxGroup
                  label={"settings"}
                  control={control}
                  name={"settings"}
                  options={values?.fork_settings ?? []}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <TwoColumn className="gap-2">
                <div className="w-1/2">
                  <LabeledInput
                    name={"check_shockboot"}
                    label={"Shockboot"}
                    control={control}
                  />
                </div>
                <div className="w-1/2 mt-5">
                  <DropdownMenuItems
                    title={"Shockboot"}
                    items={values?.shockboot ?? []}
                    onSelect={(menus) => valHandler("check_shockboot", menus)}
                  />
                </div>
              </TwoColumn>
              <TwoColumn className="gap-2 w-70">
                <div className="w-1/2">
                  <LabeledInput
                    name={"check_headset"}
                    label={"Headset"}
                    control={control}
                  />
                </div>
                <div className="w-1/2 mt-5">
                  <DropdownMenuItems
                    title={"Headset"}
                    items={values?.headset ?? []}
                    onSelect={(menus) => valHandler("check_headset", menus)}
                  />
                </div>
              </TwoColumn>
              <TwoColumn className="gap-2 w-70">
                <div className="w-1/2">
                  <LabeledInput
                    name={"check_dial"}
                    label={"Dial"}
                    control={control}
                  />
                </div>
                <div className="w-1/2 mt-5">
                  <DropdownMenuItems
                    title={"Dial"}
                    items={values?.dial ?? []}
                    onSelect={(menus) => valHandler("check_dial", menus)}
                  />
                </div>
              </TwoColumn>
            </div>
            <div className="flex flex-col gap-6">
              <TwoColumn className="gap-2">
                <div className="w-1/2">
                  <LabeledInput
                    name={"check_telescope"}
                    label={"Telescope"}
                    control={control}
                  />
                </div>
                <div className="w-1/2 mt-5">
                  <DropdownMenuItems
                    title={"Telescope"}
                    items={values?.telescope ?? []}
                    onSelect={(menus) => valHandler("check_telescope", menus)}
                  />
                </div>
              </TwoColumn>
              <TwoColumn className="gap-2">
                <div className="w-1/2">
                  <LabeledInput
                    name={"check_cartridge"}
                    label={"Cartridge"}
                    control={control}
                  />
                </div>
                <div className="w-1/2 mt-5">
                  <DropdownMenuItems
                    title={"Cartridge"}
                    items={values?.cartridge ?? []}
                    onSelect={(menus) => valHandler("check_cartridge", menus)}
                  />
                </div>
              </TwoColumn>
              <TwoColumn className="gap-2 w-75">
                <div className="w-1/2">
                  <LabeledInput
                    name={"check_air"}
                    label={"Air"}
                    control={control}
                  />
                </div>
                <div className="w-1/2 mt-5">
                  <DropdownMenuItems
                    title={"Air"}
                    items={values?.air ?? []}
                    onSelect={(menus) => valHandler("check_air", menus)}
                  />
                </div>
              </TwoColumn>
            </div>
          </div>
          <HLine />
          <PageColumns className="grid-cols-2 mt-8 gap-3">
            <LabeledInput
              type="textarea"
              name={"notes_intern"}
              label={"Internal Notes Diagnosis"}
              control={control}
              rows={3}
            />
            <LabeledInput
              type="textarea"
              name={"warranty_reason"}
              label={"Warranty reason"}
              control={control}
              rows={3}
            />
          </PageColumns>
        </form>
      </div>
    </>
  );
}
