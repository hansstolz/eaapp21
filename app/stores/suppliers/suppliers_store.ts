import { StateCreator, create } from "zustand";
import { useEffect } from "react";
import { FiCreditCard, FiMail, FiUsers } from "react-icons/fi";
import { useContactStore } from "../contact/contact_store";
import { EaMails } from "@/app/data_types/forms/ea_mails";
import useMailStore from "../mails/mail_store";
import { EaCompanies } from "@/app/schemas/companies/company_schema";
import { EaContacts } from "@/app/schemas/contacts/contact_schema";
import { DropdownItem } from "@/components/app/DropDown";
import { EaPurchases } from "@/app/data_types/purachases/ea_purchases";
import { _getCompanyById } from "@/app/api/companies/companies_crud";

interface CompanySlice {
  company: EaCompanies | null;
  contacts: EaContacts[];
  mails: EaMails[];
  isNew: boolean;
  tabs: DropdownItem[];

  setCompany: (data: EaCompanies) => void;
  setNew: (isNew: boolean) => void;
  fetchData: (uid_company: number) => void;
}

const createCompanySlice: StateCreator<
  CompanySlice & PurchaseSlice,
  [],
  [],
  CompanySlice
> = (set) => ({
  isNew: false,
  company: null,
  tabs: [],
  contacts: [],
  mails: [],

  setNew: (isNew: boolean) => set({ isNew: isNew }),
  setCompany: (data: EaCompanies) => set({ company: data }),

  fetchData: async (uid_company: number) => {
    if (!uid_company || uid_company === 0) return;
    const data = await _getCompanyById(uid_company);
    set({
      contacts: data?.contacts ?? [],
      company: data.company ?? null,
      purchases: data?.purchases ?? [],
      mails: data?.mails ?? [],
      tabs: [
        { label: "Contacts", value: "contact", icon: FiUsers },
        { label: "Purchases", value: "purchases", icon: FiCreditCard },
        { label: "Mails", value: "mail", icon: FiMail },
      ],
    });
  },
});

interface PurchaseSlice {
  purchases: EaPurchases[];
}
const createPurchaseSlice: StateCreator<
  CompanySlice & PurchaseSlice,
  [],
  [],
  PurchaseSlice
> = () => ({
  purchases: [],
});

export const useBoundStore = create<CompanySlice & PurchaseSlice>()((...a) => ({
  ...createCompanySlice(...a),
  ...createPurchaseSlice(...a),
}));

export const useUpdateBoundStore = (uid_company: number) => {
  const fetchData = useBoundStore((state) => state.fetchData);
  const company = useBoundStore((state) => state.company);
  const contacts = useBoundStore((state) => state.contacts);
  const mails = useBoundStore((state) => state.mails);
  const setMails = useMailStore((state) => state.setMails);
  const setContacts = useContactStore((state) => state.setContacts);
  const setContactType = useContactStore((state) => state.setContactType);
  const setUidCustomerOrSupplier = useContactStore(
    (state) => state.setUidCustomerOrSupplier,
  );
  const setContactTypeMail = useMailStore((state) => state.setContactType);
  const setUidCustomerOrSupplierMail = useMailStore(
    (state) => state.setUidCustomerOrSupplier,
  );

  useEffect(() => {
    fetchData(uid_company);
  }, [fetchData, uid_company]);

  useEffect(() => {
    setContacts(contacts);
    setContactType("supplier");
    setUidCustomerOrSupplier(uid_company);
    return () => {
      setContacts([]);
    };
  }, [
    contacts,
    setContacts,
    setContactType,
    setUidCustomerOrSupplier,
    uid_company,
  ]);

  useEffect(() => {
    setMails(mails);
    setContactTypeMail("supplier");
    setUidCustomerOrSupplierMail(uid_company);
    return () => {
      setMails([]);
    };
  }, [
    mails,
    setContactTypeMail,
    setMails,
    setUidCustomerOrSupplierMail,
    uid_company,
  ]);

  return company;
};
