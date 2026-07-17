import {
  _getDiagnosisByUidOrder,
  _getValuesDiagnosis,
  _updateDiagnosis,
} from "@/app/api/diagnosis/diagnosis_crud";
import { EaDiagnosis } from "@/data_types/diagnosis/ea_diagnosis";
import { TValuesDiagnosis } from "@/data_types/diagnosis/values_diagnosis";
import { use, useEffect } from "react";
import { create } from "zustand";
import { useOrderStore } from "../order/order_store";
import { DiagnosisType } from "@/schemas/diagnosis/DiagnosisSchema";
import { _updateWarrantyReason } from "@/app/api/warranty/warranty_crud";
import { toast } from "sonner";

export interface DiagnosisStore {
  values: TValuesDiagnosis | null;
  diagnosis: EaDiagnosis | null;
  uses: string[];
  settings: string[];

  getValuesDiagnosis: () => Promise<void>;
  getDiagnosisByUidOrder: (uid_order: number) => Promise<void>;
  submitDiagnosis: (data: DiagnosisType) => Promise<void>;
}

export const createDiagnosisStore = create<DiagnosisStore>((set, get) => ({
  values: null,
  diagnosis: null,
  uses: [],
  settings: [],

  getValuesDiagnosis: async () => {
    const values = await _getValuesDiagnosis();
    set({ values });
  },

  getDiagnosisByUidOrder: async (uid_order: number) => {
    const diagnosis = await _getDiagnosisByUidOrder(uid_order);
    const uses = diagnosis?.fork_use?.split("\n") || [];
    const settings = diagnosis?.fork_setting?.split("\n") || [];

    set({ diagnosis, uses, settings });
  },

  submitDiagnosis: async (data: DiagnosisType) => {
    const { uses, settings, ...diag } = data;

    const diagnosis: EaDiagnosis = {
      ...diag,
      fork_use: uses?.join("\n") ?? "",
      fork_setting: settings?.join("\n") ?? "",
      worker_diagnosis_no: null,
      printstatus_diagnosis: null,
      warranty_request: null,
      work_diagnosis_time_end: null,
      work_diagnosis_time_start: null,
      user_group: null,
      created_at: null,
      updated_at: null,
    };

    const updatedDiagnosis = await _updateDiagnosis(diagnosis);
    toast.success("Diagnosis updated successfully!");

    set({ diagnosis: updatedDiagnosis });
  },
}));

export const useDiagnosisStore = () => {
  const { order } = useOrderStore();
  const {
    getValuesDiagnosis,
    getDiagnosisByUidOrder,
    diagnosis,
    uses,
    settings,
    values,
    submitDiagnosis,
  } = createDiagnosisStore();

  useEffect(() => {
    if (order) {
      getValuesDiagnosis();
      getDiagnosisByUidOrder(order.uid_order);
    }
  }, [order]);
  return { diagnosis, values, uses, settings, submitDiagnosis };
};
