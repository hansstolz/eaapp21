import { create } from "zustand";
import type { EaMails } from "@/data_types/forms/ea_mails";
import {
  _getMailsByCompany,
  _getMailsByCustomer,
} from "@/app/api/mails/mails_crud";
import { createTypeSlice, TypeSlice } from "../common/type_slice";

export interface MailStore {
  mails: EaMails[];

  setMails: (data: EaMails[]) => void;
  getMailsByCustomer: (uid_customer: number) => Promise<void>;
}

const useMailStore = create<MailStore & TypeSlice>((set, get, ...a) => ({
  ...createTypeSlice(set, get, ...a),
  mails: [],

  setMails: (data: EaMails[]) => set({ mails: data }),

  getMailsByCustomer: async (uid_customer: number) => {
    const mails = await _getMailsByCustomer(uid_customer);
    set({
      mails: mails ?? [],
      uid_customer_or_supplier: uid_customer,
      contactType: "customer",
    });
  },
}));

export default useMailStore;
