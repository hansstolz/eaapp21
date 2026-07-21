import { useCallback, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import copyToClipboard from "@/lib/hooks/useCopy";
import { useOrderStore } from "@/app/stores/order/order_store";
import { useDiagnosisStore } from "@/app/stores/diagnosis/diagnosis_store";
import { useWarrantyStore } from "@/app/stores/warranty/warranty_store";
import { useCostestimateStore } from "@/app/stores/costestimate/costestimate_store";
import { useWorksheetStore } from "@/app/stores/worksheet/worksheet_store";
import { worksheetSchema, type WorksheetForm } from "./WorksheetSchema";

export default function WorksheetController() {
  const { order } = useOrderStore();
  const { diagnosis, uses, settings } = useDiagnosisStore();
  const { warranty } = useWarrantyStore();
  const { isConfirmed } = useCostestimateStore();
  const {
    worksheet,
    compr_in,
    neg_spring,
    oil_viscosity,
    coil_spring,
    air_pressure,
    saveWorksheet,
  } = useWorksheetStore();

  const form = useForm<WorksheetForm>({ resolver: zodResolver(worksheetSchema) });
  const { reset, handleSubmit, formState: { isDirty } } = form;
  const dirty = useRef(false);

  useEffect(() => {
    dirty.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    if (worksheet) reset(worksheet);
  }, [reset, worksheet]);

  const submitHandler = useCallback(
    async (data: WorksheetForm) => saveWorksheet(data),
    [saveWorksheet],
  );

  useEffect(() => {
    return () => {
      if (dirty.current) void handleSubmit(submitHandler)();
    };
  }, [handleSubmit, submitHandler]);

  const copyToCal = async () => {
    if (!order || !worksheet) return;
    const ok = await copyToClipboard({
      copyMe: `${order.getNameCustNo()}\nWorksheet: #${worksheet.worksheet_no}\n${order.getForkModelColor()}`,
    });
    if (ok) toast.success("Worksheet info copied to clipboard");
    else toast.error("Failed to copy worksheet info to clipboard");
  };

  return {
    ...form,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    diagnosis: diagnosis ? { ...diagnosis, uses, settings } : null,
    warranty,
    isConfirmed,
    worksheet,
    compr_in,
    neg_spring,
    oil_viscosity,
    coil_spring,
    air_pressure,
    submitHandler,
    copyToCal,
  };
}
